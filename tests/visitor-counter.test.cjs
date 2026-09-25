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

const counter = load('src/lib/visitorCounter.js');
const handler = load('src/pages/api/visitors.js', { '../../lib/visitorCounter': counter }).default;
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
  process.env.VISITOR_COUNTER_SECRET = 'test-secret-that-is-at-least-32-characters';
  process.env.VISITOR_COUNTER_NAMESPACE = 'test';
}

async function request(method = 'GET', { body, cookie, origin = 'https://site.example', headers = {} } = {}) {
  const req = {
    method, body,
    headers: { host: 'site.example', origin, ...headers },
    cookies: cookie ? { [counter.VISITOR_COOKIE]: cookie } : {},
  };
  const res = {
    statusCode: 200, headers: {}, body: null,
    setHeader(key, value) { this.headers[key.toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
  };
  await handler(req, res);
  return res;
}

test('GET reads only the total, sends server-only credentials, and is never cached', async () => {
  configure();
  global.fetch = async (url, options) => {
    assert.equal(url, process.env.UPSTASH_REDIS_REST_URL);
    assert.equal(options.headers.Authorization, 'Bearer private-test-credential');
    assert.deepEqual(JSON.parse(options.body), ['GET', '{test:visitors}:total']);
    assert.equal(options.cache, 'no-store');
    return { ok: true, json: async () => ({ result: '1284' }) };
  };
  const res = await request();
  assert.deepEqual(res.body, { count: 1284 });
  assert.equal(res.headers['set-cookie'], undefined);
  assert.match(res.headers['cache-control'], /no-store/);
  assert.equal(res.headers['vercel-cdn-cache-control'], 'no-store');
});

test('missing configuration fails closed without leaking secrets', async () => {
  configure();
  delete process.env.VISITOR_COUNTER_SECRET;
  global.fetch = async () => { throw new Error('Must not connect'); };
  const res = await request();
  assert.equal(res.statusCode, 503);
  assert.deepEqual(res.body, { error: 'Visitor counter unavailable' });
});

test('cross-origin requests, missing consent and unsupported methods cannot count', async () => {
  configure();
  global.fetch = async () => { throw new Error('Must not connect'); };
  assert.equal((await request('POST', { origin: 'https://other.example', body: { action: 'count', consent: true } })).statusCode, 403);
  assert.equal((await request('POST', { body: { action: 'count' } })).statusCode, 400);
  const unsupported = await request('PUT');
  assert.equal(unsupported.statusCode, 405);
  assert.equal(unsupported.headers.allow, 'GET, POST, DELETE');
});

test('prepare sets a secure HttpOnly cookie but exposes no token and never increments', async () => {
  configure();
  global.fetch = async () => { throw new Error('Prepare must not access storage'); };
  const prepared = await request('POST', { body: { action: 'prepare', consent: true } });
  assert.equal(prepared.statusCode, 200);
  assert.deepEqual(prepared.body, { ready: true });
  assert.match(prepared.headers['set-cookie'], /HttpOnly; SameSite=Strict; Secure/);
  const cookie = prepared.headers['set-cookie'].split(';')[0].split('=')[1];
  assert.ok(counter.readVisitorToken(cookie, process.env.VISITOR_COUNTER_SECRET));
  const repeat = await request('POST', { body: { action: 'prepare', consent: true }, cookie });
  assert.equal(repeat.headers['set-cookie'], undefined, 'Returning browsers keep the original expiry');
});

test('blocked cookies, tampered tokens, and expired tokens cannot increment', async () => {
  configure();
  global.fetch = async () => { throw new Error('Must not connect'); };
  const secret = process.env.VISITOR_COUNTER_SECRET;
  const expired = counter.createVisitorToken(secret, Math.floor(Date.now() / 1000) - counter.VISITOR_MAX_AGE - 1);
  for (const cookie of [undefined, 'forged', expired, counter.createVisitorToken(secret) + 'x']) {
    const res = await request('POST', { body: { action: 'count', consent: true }, cookie });
    assert.equal(res.statusCode, 409);
  }
});

test('concurrent requests submit one atomic script and stable hashed identities; retries deduplicate', async () => {
  configure();
  const seen = new Set();
  let total = 0;
  // Simulate the atomic Redis command contract. The deployed Lua script still
  // needs a real Redis smoke test; this exercises route wiring and retries.
  global.fetch = async (_url, options) => {
    const [command, script, keyCount, totalKey, markerKey, ttl] = JSON.parse(options.body);
    assert.equal(command, 'EVAL');
    assert.equal(script, counter.COUNT_VISITOR_SCRIPT);
    assert.equal(keyCount, 2);
    assert.equal(totalKey, '{test:visitors}:total');
    assert.match(markerKey, /^\{test:visitors\}:seen:[a-f0-9]{64}$/);
    assert.ok(ttl > 0 && ttl <= counter.VISITOR_MAX_AGE);
    if (!seen.has(markerKey)) { seen.add(markerKey); total += 1; }
    const result = total;
    return { ok: true, json: async () => ({ result }) };
  };
  const cookies = Array.from({ length: 10 }, () => counter.createVisitorToken(process.env.VISITOR_COUNTER_SECRET));
  const results = await Promise.all(Array.from({ length: 100 }, (_, index) => request('POST', {
    body: { action: 'count', consent: true }, cookie: cookies[index % cookies.length],
  })));
  assert.equal(total, 10);
  for (const result of results) {
    assert.equal(result.statusCode, 200);
    assert.deepEqual(Object.keys(result.body), ['count']);
  }
  const retried = await request('POST', { body: { action: 'count', consent: true }, cookie: cookies[0] });
  assert.equal(retried.body.count, 10);
});

test('storage errors, timeouts and invalid results return generic failures', async () => {
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
    assert.deepEqual(res.body, { error: 'Visitor counter unavailable' });
  }
});

test('withdrawal clears cookie even without Redis configuration', async () => {
  configure();
  delete process.env.VISITOR_COUNTER_SECRET;
  const res = await request('DELETE');
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['set-cookie'], /Max-Age=0/);
  assert.deepEqual(res.body, { enabled: false });
});

test('cookie expiry bounds retention and altered signatures are rejected', () => {
  const secret = 'test-signing-secret';
  const token = counter.createVisitorToken(secret, 1800000000);
  assert.equal(counter.readVisitorToken(token, secret, 1800000100).remaining, counter.VISITOR_MAX_AGE - 100);
  assert.equal(counter.readVisitorToken(token, secret, 1800000000 + counter.VISITOR_MAX_AGE), null);
  assert.equal(counter.readVisitorToken(token, 'another-secret', 1800000000), null);
});

test('footer counter renders no fabricated number during SSR', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const VisitorCounter = load('src/components/VisitorCounter.jsx').default;
  assert.equal(renderToStaticMarkup(React.createElement(VisitorCounter)), '');
});
