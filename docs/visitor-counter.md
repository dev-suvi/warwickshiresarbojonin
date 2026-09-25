# Footer page-view counter

The footer now shows **Page views**, not unique visitors. It automatically counts
initial page loads, refreshes and completed Next.js page navigation. Shallow URL
updates and hash links are not counted. There is no permission prompt.

## Vercel setup

1. Keep the existing Upstash Redis integration connected to this project, including
   the **Production** environment.
2. Set either `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, or
   `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Use the read/write REST token.
   Do not prefix credentials with `NEXT_PUBLIC_`.
3. `VISITOR_COUNTER_SECRET` is no longer used or required. It can be removed from
   local and Vercel environment settings.
4. Deploy using Vercel's Next.js preset and `next build`, with no `out` output
   override or static export. The API runs as a function; pages remain static.
5. Open `/api/page-views` to read the total without incrementing it. Load a website
   page or refresh to add one. The footer places the number beside social icons
   on screens 640px and wider, and below them on mobile.

For local development, keep credentials in gitignored `.env.local` and restart
`npm run dev` after changing them. Never commit or share credentials.

## Stored data and counting

Only one aggregate integer is stored in Redis. The application does not create,
read or use tracking cookies, localStorage, sessionStorage, visitor IDs, IP-based
identification, fingerprints, or page-by-page histories for this counter. The
client sends only `{ "action": "view" }`, omitting cookies and referrer information.
Hosting/storage providers still process network requests for delivery and security.

Redis INCR updates the total atomically, so simultaneous views cannot overwrite
one another. The total has no expiry and survives deployments. The default key is
`{warwickshire-production:page-views}:total` in production, with separate development
and preview namespaces. `PAGE_VIEW_COUNTER_NAMESPACE` can override the namespace;
existing `VISITOR_COUNTER_NAMESPACE` settings remain supported as a fallback.
Use letters, digits, hyphens or underscores. Keep production settings stable and
Redis eviction disabled to preserve the total.

The client counts after hydration and reuses the initial request during React
Strict Mode's effect replay. It listens for completed route changes, not clicks or
prefetches. It does not automatically retry a failed POST because the increment
may already have succeeded. With no persistent browser identity, this is an
approximate page-view metric, not an abuse-resistant measure of real people.
JavaScript-disabled visits or blocked/failed requests may not count; automated
requests may inflate it. A service failure hides the number or keeps the last
successfully loaded total without interrupting the website.

## Migration from the opt-in visitor counter

Page views use a **new key starting at zero**. Historical opted-in visitor totals
are not relabelled as page views. The old `/api/visitors` route, cookie code,
signing logic, identifier storage and permission UI have been removed.

Existing `ws_visitor` cookies and `ws-visitor-counting` preferences from the old
version are no longer read, sent by the counter, refreshed, or used. Old cookies
expire on their original schedule. Old Redis `:seen:` keys also expire under their
original TTL; the old aggregate remains separate. The unused browser preference
can be removed through browser settings. No old records are deleted automatically.

## Verification

Run `node --test tests/page-view-counter.test.cjs` and
`npm run build -- --webpack`. Tests cover atomic-command wiring, repeated views,
origin checks, failures, cookie-free requests, SSR, effect replay and navigation.
The default Turbopack build previously stalled locally.

Provider documentation: https://upstash.com/docs/redis/features/restapi
