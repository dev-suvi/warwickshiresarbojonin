import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Eye } from 'lucide-react';

export async function recordPageView() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch('/api/page-views', {
      method: 'POST',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view' }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Page-view counter unavailable');
    const data = await response.json();
    if (!Number.isSafeInteger(data.count) || data.count < 0) throw new Error('Invalid page-view count');
    return data.count;
  } finally {
    clearTimeout(timeout);
  }
}

export default function PageViewCounter() {
  const { events, isReady } = useRouter();
  const [count, setCount] = useState(null);
  const initialRequest = useRef(null);

  useEffect(() => {
    if (!isReady) return undefined;
    let active = true;
    let latestRequest = 0;

    function display(request) {
      const requestNumber = ++latestRequest;
      request.then((total) => {
        if (active && requestNumber === latestRequest) setCount(total);
      }).catch(() => {
        // Keep the last known total, or hide the counter if the first load fails.
      });
    }

    // Reuse the initial promise during React Strict Mode's effect replay.
    // This is only in component memory; no cookies, storage, or browser IDs.
    if (!initialRequest.current) initialRequest.current = recordPageView();
    display(initialRequest.current);

    const onRouteChange = (_url, { shallow } = {}) => {
      if (!shallow) display(recordPageView());
    };
    events.on('routeChangeComplete', onRouteChange);
    return () => {
      active = false;
      events.off('routeChangeComplete', onRouteChange);
    };
  }, [events, isReady]);

  if (count === null) return null;

  return (
    <div
      className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-[#f3d4a1]/30 bg-gradient-to-br from-[#f3d4a1]/10 to-[#f3d4a1]/[0.03] px-4 py-3 shadow-sm"
      title="Page loads and navigation, including refreshes; not unique visitors"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3d4a1]/10 text-[#f3d4a1]">
        <Eye className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="min-w-0">
        <span className="block break-words text-2xl font-bold leading-none tracking-tight text-[#fff7f2] tabular-nums">
          {count.toLocaleString('en-GB')}
        </span>
        <span className="mt-1.5 block text-[10px] font-semibold uppercase leading-tight tracking-[0.18em] text-[#f3d4a1]">
          {count === 1 ? 'Page view' : 'Page views'}
        </span>
      </p>
    </div>
  );
}
