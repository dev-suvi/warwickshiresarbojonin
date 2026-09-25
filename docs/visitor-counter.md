# Footer visitor counter

## Vercel setup

1. In the Vercel Marketplace, add **Upstash Redis** and connect it to this project:
   https://vercel.com/marketplace/upstash
2. Ensure the integration provides either `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN`, or `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
   Use the read/write REST token. Never prefix these variables with `NEXT_PUBLIC_`.
3. Add a server-only `VISITOR_COUNTER_SECRET` environment variable. Generate a
   random value with `openssl rand -hex 32` and paste it directly into Vercel's
   environment-variable settings. Keep it stable between deployments.
4. Redeploy using Vercel's **Next.js** framework preset and `next build`. Do not
   override the output directory to `out` or use `next export`: `/api/visitors`
   needs a Vercel Function. The existing static pages remain prerendered.
5. Check `/api/visitors` returns `{"count":0}` initially. Open the footer privacy
   disclosure and choose **Allow visitor counting**. Refresh: the count should
   stay the same. Another consenting browser should add one.

No new npm dependency is required: the server uses Upstash's REST API via fetch.
https://upstash.com/docs/redis/features/restapi

For local development, place the same variables in the gitignored `.env.local`
and run `npm run dev`. Set separate secrets for development/preview and production.
The default Redis namespace is `warwickshire-${VERCEL_ENV || 'development'}`,
so preview and local visits do not change the production count. You can override
it with `VISITOR_COUNTER_NAMESPACE` (letters, digits, hyphens and underscores).
Leave the production namespace stable, and use a separate database for staging
if stronger isolation is needed. Do not enable Redis key eviction for this data.

## Behaviour and stored data

- GET reads only the aggregate. It never sets cookies or increments anything.
- Counting requires opt-in. Consent is remembered in localStorage for one year;
  localStorage does not store a visitor ID or the shared count.
- POST prepare creates a signed, random HttpOnly, SameSite=Strict cookie, Secure
  in production. The next POST must return the cookie before anything is counted.
  Cookie-blocking browsers are therefore not counted on each refresh.
- Browser JavaScript never reads the token. As with all cookies, the browser
  owner can inspect their own cookie using developer tools.
- An HMAC of the random ID becomes a Redis marker key, retained only until the
  cookie's original expiry (at most 365 days). Returning visits do not extend it.
  The total has no expiry and survives deployments. There is no historical count
  to import; it begins at zero when first enabled.
- A Lua script checks the marker and updates the total without concurrent
  requests interleaving. Retrying the same visit does not increment again.
- Web Locks serialize initial cookie creation between tabs where supported.
  Simultaneous first visits in browsers without Web Locks can still overcount.
- Responses expose only totals or generic status/errors, never tokens, hashes,
  credentials, IP addresses, or provider error details. APIs are not cached.
- Cookie deletion, different devices, expiry, and deliberately automated visits
  can raise the total. This is an estimate of consenting browsers, not people.
- Revoking consent stops future counting and clears the cookie. The aggregate
  remains; the deduplication marker expires on its original schedule. Reconsenting
  after cookie deletion can count again.
- The counter loads after hydration. Missing configuration, invalid responses,
  or storage outages hide the number, or retain the last successfully loaded total.
  Previously opted-in browsers can still access the withdrawal control during outages.

## Privacy and operation

The footer explains the optional cookie, preference storage, provider, retention,
and withdrawal. No tracking occurs until opt-in; reading the public total requires
no tracking cookie. Token hashes are pseudonymous, not anonymous personal data.
Keep your site's privacy notice and Upstash processing agreement/region consistent
with this use. Vercel/Upstash infrastructure may process network metadata for
delivery/security; this application does not use IPs for identification or logging.
See https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/

Keep Redis credentials and the signing secret private. Review provider usage and
configure appropriate spending limits. Same-origin checks and signed cookies
reduce accidental or cross-site increments, but the public counter is not a
fraud-proof analytics system. If abuse occurs, use hosting-level protections.

Rotating the signing secret invalidates existing cookies and can cause returning
browsers to count again. Deleting Redis keys, changing namespace, or moving to a
new database without migrating data resets the total; do not do so on redeploy.

## Verification

Run `node --test tests/visitor-counter.test.cjs` for API/privacy/failure tests.
The tests use a mocked REST transport; validate the deployed Redis script with
two browsers after connecting the real service. Production build:
`npm run build -- --webpack` (the default Turbopack build stalled locally).
