import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const VISITOR_MAX_AGE = 60 * 60 * 24 * 365;
export const VISITOR_COOKIE = 'ws_visitor';

// Redis executes the entire script without interleaving concurrent requests.
export const COUNT_VISITOR_SCRIPT = `
  if redis.call('EXISTS', KEYS[2]) == 1 then
    return redis.call('GET', KEYS[1]) or '0'
  end
  local total = redis.call('INCR', KEYS[1])
  local marker = redis.pcall('SET', KEYS[2], '1', 'EX', ARGV[1])
  if type(marker) == 'table' and marker.err then
    redis.call('DECR', KEYS[1])
    return redis.error_reply(marker.err)
  end
  return total
`;

export function counterConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const secret = process.env.VISITOR_COUNTER_SECRET;
  const namespace = process.env.VISITOR_COUNTER_NAMESPACE || `warwickshire-${process.env.VERCEL_ENV || 'development'}`;
  if (!url || !token || !secret || secret.length < 32 || !/^[a-zA-Z0-9_-]+$/.test(namespace)) {
    throw new Error('Visitor counter is not configured');
  }
  if (new URL(url).protocol !== 'https:') throw new Error('Redis requires HTTPS');
  return { url, token, secret, prefix: `{${namespace}:visitors}` };
}

function sign(value, secret) {
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function createVisitorToken(secret, now = Math.floor(Date.now() / 1000)) {
  const payload = `${randomBytes(32).toString('hex')}.${now + VISITOR_MAX_AGE}`;
  return `${payload}.${sign(`cookie:${payload}`, secret)}`;
}

export function readVisitorToken(value, secret, now = Math.floor(Date.now() / 1000)) {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}\.\d{10}\.[a-f0-9]{64}$/.test(value)) return null;
  const [id, expires, signature] = value.split('.');
  const remaining = Number(expires) - now;
  if (remaining <= 0 || remaining > VISITOR_MAX_AGE) return null;
  const expected = sign(`cookie:${id}.${expires}`, secret);
  if (!timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))) return null;
  return { hash: sign(`visitor:${id}`, secret), remaining };
}

export function visitorCookie(value, maxAge = VISITOR_MAX_AGE) {
  return `${VISITOR_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export async function redisCommand(config, command) {
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error('Visitor storage unavailable');
  const data = await response.json();
  if (data.error || !Object.prototype.hasOwnProperty.call(data, 'result')) {
    throw new Error('Visitor storage unavailable');
  }
  return data.result;
}

export function parseVisitorCount(value) {
  if (value === null) return 0;
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) {
    throw new Error('Invalid visitor count');
  }
  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid visitor count');
  return count;
}
