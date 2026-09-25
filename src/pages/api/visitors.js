import {
  COUNT_VISITOR_SCRIPT, VISITOR_COOKIE, counterConfig, createVisitorToken,
  parseVisitorCount, readVisitorToken, redisCommand, visitorCookie,
} from '../../lib/visitorCounter';

export const config = { api: { bodyParser: { sizeLimit: '1kb' } } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.method !== 'GET') {
    // Only browser requests from this site's origin may set cookies or count.
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    if (req.headers.origin !== `${protocol}://${req.headers.host}` ||
        req.headers['sec-fetch-site'] === 'cross-site') {
      return res.status(403).json({ error: 'Request not allowed' });
    }
    if (req.method === 'DELETE') {
      res.setHeader('Set-Cookie', visitorCookie('', 0));
      return res.status(200).json({ enabled: false });
    }
    if (req.body?.consent !== true || !['prepare', 'count'].includes(req.body?.action)) {
      return res.status(400).json({ error: 'Consent and a valid action are required' });
    }
  }

  try {
    const storage = counterConfig();
    const totalKey = `${storage.prefix}:total`;
    if (req.method === 'GET') {
      const count = parseVisitorCount(await redisCommand(storage, ['GET', totalKey]));
      return res.status(200).json({ count });
    }

    const visitor = readVisitorToken(req.cookies?.[VISITOR_COOKIE], storage.secret);
    if (req.body.action === 'prepare') {
      if (!visitor) res.setHeader('Set-Cookie', visitorCookie(createVisitorToken(storage.secret)));
      return res.status(200).json({ ready: true });
    }

    // A separate round trip proves the browser accepted the cookie. Browsers
    // blocking cookies are never counted again on every refresh.
    if (!visitor) return res.status(409).json({ error: 'Visitor cookie unavailable' });

    const result = await redisCommand(storage, [
      'EVAL', COUNT_VISITOR_SCRIPT, 2, totalKey,
      `${storage.prefix}:seen:${visitor.hash}`, visitor.remaining,
    ]);
    return res.status(200).json({ count: parseVisitorCount(result) });
  } catch {
    // Never return storage errors, credentials, tokens or hashes to the client.
    return res.status(503).json({ error: 'Visitor counter unavailable' });
  }
}
