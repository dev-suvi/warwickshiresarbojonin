import { useEffect, useRef, useState } from 'react';

const PREFERENCE_KEY = 'ws-visitor-counting';
const PREFERENCE_LIFETIME = 365 * 24 * 60 * 60 * 1000;

function hasConsent() {
  try {
    const preference = JSON.parse(localStorage.getItem(PREFERENCE_KEY));
    return preference?.enabled === true && preference.expires > Date.now();
  } catch {
    return false;
  }
}

async function requestCounter(method = 'GET', body, signal) {
  const response = await fetch('/api/visitors', {
    method,
    credentials: 'same-origin',
    cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  if (!response.ok) throw new Error('Visitor counter unavailable');
  const data = await response.json();
  if (method === 'GET' || body?.action === 'count') {
    if (!Number.isSafeInteger(data.count) || data.count < 0) throw new Error('Invalid visitor count');
  }
  return data;
}

async function withVisitorLock(callback) {
  // Serialize cookie creation between tabs where Web Locks is supported.
  if (navigator.locks?.request) return navigator.locks.request('ws-visitor-counting', callback);
  return callback();
}

export default function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const operation = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    operation.current = controller;
    async function load() {
      // Keep withdrawal available even when the count service is offline.
      setEnabled(hasConsent());
      try {
        const current = await requestCounter('GET', undefined, controller.signal);
        if (controller.signal.aborted) return;
        setCount(current.count);
        setEnabled(hasConsent());
        if (hasConsent()) {
          await withVisitorLock(async () => {
            if (!hasConsent() || controller.signal.aborted) return;
            await requestCounter('POST', { action: 'prepare', consent: true }, controller.signal);
            if (!hasConsent() || controller.signal.aborted) return;
            const updated = await requestCounter('POST', { action: 'count', consent: true }, controller.signal);
            if (!controller.signal.aborted) setCount(updated.count);
          });
        }
      } catch {
        // Keep an already loaded total, or hide the counter if loading failed.
      } finally {
        clearTimeout(timeout);
      }
    }
    load();
    const syncPreference = (event) => {
      if (event.key === PREFERENCE_KEY || event.key === null) {
        setEnabled(hasConsent());
        if (!hasConsent()) operation.current?.abort();
      }
    };
    window.addEventListener('storage', syncPreference);
    return () => {
      controller.abort();
      operation.current?.abort();
      clearTimeout(timeout);
      window.removeEventListener('storage', syncPreference);
    };
  }, []);

  async function updateConsent(allow) {
    operation.current?.abort();
    const controller = new AbortController();
    operation.current = controller;
    const timeout = setTimeout(() => controller.abort(), 12000);
    setBusy(true);
    setMessage('');
    let preferenceSaved = false;
    try {
      // If preference storage is blocked, do not proceed with counting.
      localStorage.setItem(PREFERENCE_KEY, JSON.stringify({ enabled: allow, expires: Date.now() + PREFERENCE_LIFETIME }));
      preferenceSaved = true;
      setEnabled(allow);
      await withVisitorLock(async () => {
        if (controller.signal.aborted) return;
        if (!allow) {
          await requestCounter('DELETE', undefined, controller.signal);
          return;
        }
        if (!hasConsent()) return;
        await requestCounter('POST', { action: 'prepare', consent: true }, controller.signal);
        if (!hasConsent() || controller.signal.aborted) return;
        const updated = await requestCounter('POST', { action: 'count', consent: true }, controller.signal);
        if (!controller.signal.aborted) setCount(updated.count);
      });
      setMessage(allow ? 'Thank you. Visitor counting is enabled.' : 'Visitor counting is off. Your previous visit remains in the anonymous total.');
    } catch {
      setMessage(!preferenceSaved
        ? 'Your browser could not save this preference. Please check your browser storage settings.'
        : allow ? 'Unable to count this visit. You can try again later.' : 'Counting is off in this browser. The cookie could not be cleared; please clear it in your browser settings.');
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }

  if (count === null && !enabled) return null;

  return (
    <div className="mt-5 max-w-xl text-sm text-[#f3d4a1]/90">
      {count !== null && (
        <p className="font-semibold tabular-nums" title="Approximate consenting browsers counted since this counter launched">
          {count.toLocaleString('en-GB')} {count === 1 ? 'Visitor' : 'Visitors'}
        </p>
      )}
      <details className="mt-1">
        <summary className="w-fit cursor-pointer rounded text-xs underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300">
          About this count &amp; privacy
        </summary>
        <p className="mt-2 text-xs leading-5">
          This approximate total counts browsers that opt in. With your permission,
          we store a random first-party cookie for up to one year to avoid counting
          refreshes, and remember your choice in this browser. Our storage provider,
          Upstash, holds a protected version of that identifier for up to one year
          and an aggregate total. We do not use IP addresses or fingerprinting to
          identify visitors. Clearing cookies, using another browser, or expiry may
          count you again. You can turn counting off here at any time.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={() => updateConsent(!enabled)}
          className="mt-2 rounded border border-[#f3d4a1]/40 px-3 py-2 text-xs font-semibold hover:bg-[#f3d4a1]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 disabled:opacity-50"
        >
          {busy ? 'Updating…' : enabled ? 'Turn off visitor counting' : 'Allow visitor counting'}
        </button>
        <p role="status" className="mt-2 text-xs">{message}</p>
      </details>
    </div>
  );
}
