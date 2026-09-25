const { test, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Compile the project's JS modules with the existing TypeScript dependency.
function load(relativePath, overrides = {}) {
  const filename = path.resolve(__dirname, '..', relativePath);
  const compiled = new Module(filename, module);
  compiled.paths = module.paths;
  const originalRequire = compiled.require.bind(compiled);
  compiled.require = (name) => overrides[name] || originalRequire(name);
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  compiled._compile(output, filename);
  return compiled.exports;
}

const counter = load('src/lib/pageViewCounter.js');
const handler = load('src/pages/api/page-views.js', { '../../lib/pageViewCounter': counter }).default;
const originalEnv = { ...process.env };
const originalFetch = global.fetch;
afterEach(() => {
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv);
  global.fetch = originalFetch;
});

function configure() {
  process.env.NODE_ENV = 'production';
  process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example.test';
  process.env.UPSTASH_REDIS_REST_TOKEN = 'private-test-credential';
  process.env.PAGE_VIEW_COUNTER_NAMESPACE = 'test';
  delete process.env.VISITOR_COUNTER_SECRET;
}

async function request(method = 'GET', { body, origin = 'https://site.example', headers = {} } = {}) {
  const req = { method, body, headers: { host: 'site.example', origin, ...headers } };
  Object.defineProperty(req, 'cookies', { get() { throw new Error('Must not read cookies'); } });
  const res = {
    statusCode: 200, headers: {}, body: null,
    setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
  await handler(req, res);
  return res;
}

test('GET reads a separate page-view total with no cookies or signing secret', async () => {
  configure();
  global.fetch = async (url, options) => {
    assert.equal(url, process.env.UPSTASH_REDIS_REST_URL);
    assert.equal(options.headers.Authorization, 'Bearer private-test-credential');
    assert.deepEqual(JSON.parse(options.body), ['GET', '{test:page-views}:total']);
    assert.equal(options.cache, 'no-store');
    return { ok: true, json: async () => ({ result: '1284' }) };
  };
  const res = await request();
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { count: 1284 });
  assert.equal(res.headers['set-cookie'], undefined);
  assert.match(res.headers['cache-control'], /no-store/);
  assert.equal(res.headers['vercel-cdn-cache-control'], 'no-store');
});

test('a new store starts at zero', async () => {
  configure();
  global.fetch = async () => ({ ok: true, json: async () => ({ result: null }) });
  assert.deepEqual((await request()).body, { count: 0 });
});

test('missing configuration fails closed without leaking secrets', async () => {
  configure();
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.KV_REST_API_URL;
  const res = await request();
  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { error: 'Page-view counter unavailable' });
});

test('rejects cross-origin, missing origin, unsupported methods and legacy counting requests', async () => {
  configure();
  global.fetch = async () => { throw new Error('Must not connect'); };
  assert.equal((await request('POST', { origin: 'https://other.example', body: { action: 'view' } })).statusCode, 403);
  assert.equal((await request('POST', { origin: '', body: { action: 'view' } })).statusCode, 403);
  assert.equal((await request('POST', { headers: { 'sec-fetch-site': 'cross-site' }, body: { action: 'view' } })).statusCode, 403);
  assert.equal((await request('POST', { body: { action: 'prepare', consent: true } })).statusCode, 400);
  const unsupported = await request('DELETE');
  assert.equal(unsupported.statusCode, 405);
  assert.equal(unsupported.headers.allow, 'GET, POST');
});

test('each concurrent view uses atomic INCR, including repeat requests from the same browser', async () => {
  configure();
  let total = 0;
  // Model Redis INCR's atomic contract; never read-modify-write in the route.
  global.fetch = async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body), ['INCR', '{test:page-views}:total']);
    const result = ++total;
    return { ok: true, json: async () => ({ result }) };
  };
  const results = await Promise.all(Array.from({ length: 100 }, () => request('POST', { body: { action: 'view' } })));
  assert.equal(total, 100);
  assert.equal(new Set(results.map((result) => result.body.count)).size, 100);
  for (const result of results) {
    assert.equal(result.statusCode, 200);
    assert.equal(result.headers['set-cookie'], undefined);
    assert.deepEqual(Object.keys(result.body), ['count']);
  }
  assert.equal((await request('POST', { body: { action: 'view' } })).body.count, 101);
});

test('storage failures and invalid totals return generic errors', async () => {
  configure();
  const failures = [
    async () => { throw new Error('secret-provider-detail'); },
    async () => { throw new DOMException('Timed out', 'TimeoutError'); },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({ error: 'secret-provider-detail' }) }),
    async () => ({ ok: true, json: async () => ({ result: -1 }) }),
    async () => ({ ok: true, json: async () => ({ result: {} }) }),
  ];
  for (const failure of failures) {
    global.fetch = failure;
    const res = await request();
    assert.equal(res.statusCode, 503);
    assert.deepEqual(res.body, { error: 'Page-view counter unavailable' });
  }
});

const clientPath = 'src/components/PageViewCounter.jsx';
test('client omits cookies, referrer, identifiers and any permission requirement', async () => {
  const { recordPageView } = load(clientPath);
  global.fetch = async (url, options) => {
    assert.equal(url, '/api/page-views');
    assert.equal(options.method, 'POST');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.referrerPolicy, 'no-referrer');
    assert.equal(options.cache, 'no-store');
    assert.deepEqual(JSON.parse(options.body), { action: 'view' });
    return { ok: true, json: async () => ({ count: 2 }) };
  };
  assert.equal(await recordPageView(), 2);
});

test('effect replay and rerenders do not double-count; full navigation and reloads count', async () => {
  let effect;
  let requests = 0;
  const totals = [];
  const callbacks = new Map();
  const events = {
    on(name, callback) { callbacks.set(name, callback); },
    off(name, callback) { if (callbacks.get(name) === callback) callbacks.delete(name); },
  };
  const initialRef = { current: null };
  const Component = load(clientPath, {
    react: {
      useEffect(callback) { effect = callback; },
      useRef() { return initialRef; },
      useState() { return [null, (total) => totals.push(total)]; },
    },
    'next/router': { useRouter: () => ({ events, isReady: true }) },
  }).default;
  global.fetch = async () => ({ ok: true, json: async () => ({ count: ++requests }) });
  Component();
  const firstCleanup = effect();
  firstCleanup();
  const cleanup = effect();
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  await flush();
  assert.equal(requests, 1, 'Strict Mode replay shares the initial request');
  callbacks.get('routeChangeComplete')('/about', { shallow: false });
  await flush();
  assert.equal(requests, 2);
  callbacks.get('routeChangeComplete')('/about?section=team', { shallow: true });
  await flush();
  assert.equal(requests, 2, 'Shallow state updates do not count');
  assert.equal(callbacks.has('hashChangeComplete'), false);
  Component();
  assert.equal(requests, 2, 'Rerender alone does not count');
  cleanup();
  assert.equal(callbacks.size, 0);
  initialRef.current = null; // A full reload creates a new component instance.
  Component();
  effect()();
  await flush();
  assert.equal(requests, 3, 'Reload is a new page view');
  assert.deepEqual(totals, [1, 2], 'Unmounted callbacks do not update state');
});

test('SSR renders no number or permission prompt', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const Component = load(clientPath, {
    'next/router': { useRouter: () => ({ events: {}, isReady: false }) },
  }).default;
  assert.equal(renderToStaticMarkup(React.createElement(Component)), '');
});
