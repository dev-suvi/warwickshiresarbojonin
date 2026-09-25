import { counterConfig, parsePageViewCount, redisCommand } from '../../lib/pageViewCounter';

export const config = { api: { bodyParser: { sizeLimit: '1kb' } } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (req.method === 'POST') {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    if (req.headers.origin !== `${protocol}://${req.headers.host}` ||
        req.headers['sec-fetch-site'] === 'cross-site') {
      return res.status(403).json({ error: 'Request not allowed' });
    }
    if (req.body?.action !== 'view') {
      return res.status(400).json({ error: 'A page-view action is required' });
    }
  }

  try {
    const storage = counterConfig();
    // Redis INCR is atomic: concurrent page views cannot overwrite each other.
    const command = req.method === 'POST' ? 'INCR' : 'GET';
    const count = parsePageViewCount(await redisCommand(storage, [command, storage.totalKey]));
    return res.status(200).json({ count });
  } catch {
    return res.status(503).json({ error: 'Page-view counter unavailable' });
  }
}
