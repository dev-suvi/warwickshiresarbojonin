
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
const LightGallery = dynamic(() => import('lightgallery/react').then(m => m.default), { ssr: false });
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import GalleryCarousel from '../components/GalleryCarousel';


function pad(n, len = 2) {
  return String(Math.max(0, n ?? 0)).padStart(len, '0');
}

function Countdown({
  date = '2025-09-26T00:00:00',
  title = 'Sharadotsav 2025',
  subtitle = '26–28 Sep | Weston-Under-Weatherly Village Hall',
}) {
  const target = useMemo(() => new Date(date), [date]);

  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const prev = useRef(t);
  const [changed, setChanged] = useState({ d: false, h: false, m: false, s: false });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = Math.max(0, target - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setT({ d, h, m, s });
      setChanged({
        d: prev.current.d !== d,
        h: prev.current.h !== h,
        m: prev.current.m !== m,
        s: prev.current.s !== s,
      });
      prev.current = { d, h, m, s };

      // clear bump after a short moment
      setTimeout(() => setChanged({ d: false, h: false, m: false, s: false }), 180);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  const items = [
    { key: 'd', label: 'Day(s)',    value: pad(t.d, 2) },
    { key: 'h', label: 'Hour(s)',   value: pad(t.h) },
    { key: 'm', label: 'Minute(s)', value: pad(t.m) },
    { key: 's', label: 'Second(s)', value: pad(t.s) },
  ];

  const isOver = t.d === 0 && t.h === 0 && t.m === 0 && t.s === 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Outer glossy card */}
      <div className="relative overflow-hidden bg-gradient-to-b from-rose-600 to-rose-700 p-5 sm:p-7 ring-1 ring-white/10 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.25)]">
        {/* soft glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full bg-black/20 blur-3xl" />

        {/* header */}
        <div className="text-center text-black">
          <div className="text-xl sm:text-2xl font-extrabold tracking-wide text-white drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]">
            {title}
          </div>
          {!isOver && subtitle && (
            <div className="mt-1 text-sm sm:text-base text-white/90">{subtitle}</div>
          )}
        </div>

        {/* tiles */}
        {!isOver ? (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {items.map((it) => (
              <div
                key={it.key}
                className={`relative rounded-2xl bg-gradient-to-b from-amber-100 to-amber-50 px-6 py-6
                            shadow-xl ring-1 ring-maroon/10 flex flex-col items-center justify-center
                            ${changed[it.key] ? 'tick' : ''}`}
              >
                {/* sheen */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_35%)]" />
                <div className="relative z-10 text-rose-700 [font-variant-numeric:tabular-nums] tracking-wider font-extrabold text-5xl sm:text-6xl">
                  {it.value}
                </div>
                <div className="relative z-10 mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-rose-700/85">
                  {it.label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-center text-white text-2xl font-bold">We’re live! 🎉</div>
        )}
      </div>

      {/* micro-interaction for each tick */}
      <style jsx>{`
        .tick { animation: tick 180ms ease-out; }
        @keyframes tick {
          0%   { transform: scale(1);   filter: brightness(1);   }
          50%  { transform: scale(1.04); filter: brightness(1.1); }
          100% { transform: scale(1);   filter: brightness(1);   }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const galleryImages = [
    '/gallery/image-1.png','/gallery/image-2.png','/gallery/image-3.png',
    '/gallery/image-4.png','/gallery/image-5.png','/gallery/image-6.png'
  ];
  const eventCards = [
    { title: 'Sasthi',             date: '26<sup>th</sup> Sep 2025, Friday',   img: '/events/event1.jpg' },
    { title: 'Saptami & Asthami',  date: '27<sup>th</sup> Sep 2025, Saturday', img: '/events/event2.jpg' },
    { title: 'Nabami & Dashami',   date: '28<sup>th</sup> Sep 2025, Sunday',   img: '/events/event3.jpg' },
  ];

  return (
    <div className="text-gray-800">
     <section className="flex flex-col lg:flex-row w-full">
      {/* Image hidden on mobile */}
      <div className="hidden sm:block w-full lg:w-1/2 h-[40vh] lg:h-auto">
        <img src="/images/hero.png" alt="Durga Puja" className="w-full h-full object-cover" />
      </div>
      <div className="text-center max-w-xl">
        <Countdown title="Sharadotsav 2025" />
      </div>
    </section>

      <section className="py-10 px-6 lg:p-0 bg-gray-50 text-gray-800">
        <div className="flex flex-col lg:flex-row lg:justify-between items-center gap-12">
          <div className="w-full lg:w-1/2 lg:pl-32 pb-4">
            <h2 className="text-3xl font-bold mb-4 text-left">About Us</h2>
            <p className="text-lg leading-relaxed text-left">
              <strong>Warwickshire Sarbojonin</strong> is a vibrant cultural association dedicated to promote and
              preserve the rich heritage of India and its culture. Through a diverse range of activities including
              performing arts, music, dance, visual arts and festive community celebrations, it seeks to foster
              cultural awareness and appreciation.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-end">
            <img src="/images/about-us.png" alt="Community" />
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <p className="max-w-6xl mx-auto text-lg leading-relaxed pt-8">
            Warwickshire Sarbojonin is all set to organise its first ever Durga Puja in Warwick, UK...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {eventCards.map(ev => (
            <div key={ev.title} className="bg-white shadow rounded-lg overflow-hidden">
              <img src={ev.img} alt={ev.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{ev.title}</h3>
                <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: ev.date }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-amber-50 py-16 px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Gallery</h2>
        </div>
        <div className="max-w-6xl mx-auto">
          <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
            <GalleryCarousel images={galleryImages} />
          </LightGallery>
        </div>
      </section>
    </div>
  );
}
