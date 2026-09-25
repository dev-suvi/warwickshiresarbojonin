export function counterConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const namespace = process.env.PAGE_VIEW_COUNTER_NAMESPACE || process.env.VISITOR_COUNTER_NAMESPACE || `warwickshire-${process.env.VERCEL_ENV || 'development'}`;
  if (!url || !token || !/^[a-zA-Z0-9_-]+$/.test(namespace)) {
    throw new Error('Page-view counter is not configured');
  }
  if (new URL(url).protocol !== 'https:') throw new Error('Redis requires HTTPS');
  return { url, token, totalKey: `{${namespace}:page-views}:total` };
}

export async function redisCommand(config, command) {
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error('Page-view storage unavailable');
  const data = await response.json();
  if (data.error || !Object.prototype.hasOwnProperty.call(data, 'result')) {
    throw new Error('Page-view storage unavailable');
  }
  return data.result;
}

export function parsePageViewCount(value) {
  if (value === null) return 0;
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) {
    throw new Error('Invalid page-view count');
  }
  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid page-view count');
  return count;
}
