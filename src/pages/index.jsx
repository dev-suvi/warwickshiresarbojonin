import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { CalendarDays, HeartHandshake, MapPin, Music, Sparkles, Users } from 'lucide-react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import GalleryCarousel from '../components/GalleryCarousel';

const LightGallery = dynamic(() => import('lightgallery/react').then((module) => module.default), { ssr: false });

const EMPTY_TIME_REMAINING = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const UNCHANGED_TIME_UNITS = {
  days: false,
  hours: false,
  minutes: false,
  seconds: false,
};

function padTimeUnit(value, length = 2) {
  return String(Math.max(0, value ?? 0)).padStart(length, '0');
}

function Countdown({
  date = '2025-09-26T00:00:00',
  title = 'Sharadotsav 2025',
  subtitle = '26–28 Sep | Weston-Under-Weatherly Village Hall',
}) {
  const target = useMemo(() => new Date(date), [date]);

  const [timeRemaining, setTimeRemaining] = useState(EMPTY_TIME_REMAINING);
  const previousTimeRemaining = useRef(timeRemaining);
  const [changedUnits, setChangedUnits] = useState(UNCHANGED_TIME_UNITS);

  useEffect(() => {
    let resetAnimationTimeoutId;

    const update = () => {
      const now = new Date();
      const millisecondsRemaining = Math.max(0, target - now);
      const nextTimeRemaining = {
        days: Math.floor(millisecondsRemaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((millisecondsRemaining / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((millisecondsRemaining / (1000 * 60)) % 60),
        seconds: Math.floor((millisecondsRemaining / 1000) % 60),
      };

      setTimeRemaining(nextTimeRemaining);
      setChangedUnits({
        days: previousTimeRemaining.current.days !== nextTimeRemaining.days,
        hours: previousTimeRemaining.current.hours !== nextTimeRemaining.hours,
        minutes: previousTimeRemaining.current.minutes !== nextTimeRemaining.minutes,
        seconds: previousTimeRemaining.current.seconds !== nextTimeRemaining.seconds,
      });
      previousTimeRemaining.current = nextTimeRemaining;

      // clear bump after a short moment
      clearTimeout(resetAnimationTimeoutId);
      resetAnimationTimeoutId = setTimeout(() => setChangedUnits(UNCHANGED_TIME_UNITS), 180);
    };

    update();
    const intervalId = setInterval(update, 1000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(resetAnimationTimeoutId);
    };
  }, [target]);

  const countdownUnits = [
    { key: 'days', label: 'Day(s)', value: padTimeUnit(timeRemaining.days, 2) },
    { key: 'hours', label: 'Hour(s)', value: padTimeUnit(timeRemaining.hours) },
    { key: 'minutes', label: 'Minute(s)', value: padTimeUnit(timeRemaining.minutes) },
    { key: 'seconds', label: 'Second(s)', value: padTimeUnit(timeRemaining.seconds) },
  ];

  const isCountdownComplete = Object.values(timeRemaining).every((value) => value === 0);

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
          {!isCountdownComplete && subtitle && (
            <div className="mt-1 text-sm sm:text-base text-white/90">{subtitle}</div>
          )}
        </div>

        {/* tiles */}
        {!isCountdownComplete ? (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {countdownUnits.map((unit) => (
              <div
                key={unit.key}
                className={`relative rounded-2xl bg-gradient-to-b from-amber-100 to-amber-50 px-6 py-6
                            shadow-xl ring-1 ring-maroon/10 flex flex-col items-center justify-center
                            ${changedUnits[unit.key] ? 'tick' : ''}`}
              >
                {/* sheen */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0)_35%)]" />
                <div className="relative z-10 text-rose-700 [font-variant-numeric:tabular-nums] tracking-wider font-extrabold text-5xl sm:text-6xl">
                  {unit.value}
                </div>
                <div className="relative z-10 mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-rose-700/85">
                  {unit.label}
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
    { title: 'Sasthi', dateHtml: '26<sup>th</sup> Sep 2025, Friday', imageSrc: '/events/event1.jpg' },
    { title: 'Saptami & Asthami', dateHtml: '27<sup>th</sup> Sep 2025, Saturday', imageSrc: '/events/event2.jpg' },
    { title: 'Nabami & Dashami', dateHtml: '28<sup>th</sup> Sep 2025, Sunday', imageSrc: '/events/event3.jpg' },
  ];

  const festivalHighlights = [
    {
      title: 'Puja & Rituals',
      description: 'Traditional worship, anjali, arati, dhunuchi moments, and shared devotion across the festival days.',
      icon: Sparkles,
    },
    {
      title: 'Cultural Stage',
      description: 'Music, dance, recitation, children’s performances, and community-led creative programs.',
      icon: Music,
    },
    {
      title: 'Community Table',
      description: 'Warm hospitality, familiar food, new friendships, and a welcoming space for every generation.',
      icon: Users,
    },
  ];

  return (
    <main className="text-gray-900">
      <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-black text-white">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero-mobile.png" />
          <img
            src="/images/hero.png"
            alt="Durga Puja celebration"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,6,6,0.86)_0%,rgba(20,6,6,0.58)_45%,rgba(20,6,6,0.18)_100%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl flex-col justify-center px-6 py-16">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 bg-amber-300 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-rose-950">
              <Sparkles className="h-4 w-4" />
              Warwickshire Durga Puja
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
              Warwickshire Sarbojonin
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
              A vibrant community celebration of Durga Puja, Indian culture, food, music, arts, and togetherness in Warwickshire.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 bg-amber-300 px-6 py-3 font-bold text-rose-950 transition hover:bg-amber-200"
              >
                <CalendarDays className="h-5 w-5" />
                View Events
              </Link>
              <Link
                href="/location"
                className="inline-flex items-center justify-center gap-2 border border-white/70 px-6 py-3 font-bold text-white transition hover:bg-white hover:text-rose-950"
              >
                <MapPin className="h-5 w-5" />
                Find Venue
              </Link>
            </div>
          </div>

          <div className="mt-12 max-w-3xl">
            <Countdown
              date="2026-10-17T00:00:00"
              title="Sharadotsav 2026"
              subtitle="Warwickshire Durga Puja celebration countdown"
            />
          </div>
        </div>
      </section>

      <section className="bg-amber-50 px-6 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700">About the community</p>
            <h2 className="mt-3 text-4xl font-extrabold text-rose-950">Culture, devotion, and belonging under one roof.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              <strong>Warwickshire Sarbojonin</strong> promotes and preserves Indian heritage through festivals,
              performing arts, music, dance, visual arts, and community celebrations. The spirit is simple:
              everyone is welcome, every family has a place, and every celebration carries a little piece of home.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border-l-4 border-rose-700 bg-white p-5 shadow-sm">
                <p className="text-3xl font-extrabold text-rose-800">3</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Festival Days</p>
              </div>
              <div className="border-l-4 border-amber-500 bg-white p-5 shadow-sm">
                <p className="text-3xl font-extrabold text-rose-800">All</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Ages Welcome</p>
              </div>
              <div className="border-l-4 border-rose-700 bg-white p-5 shadow-sm">
                <p className="text-3xl font-extrabold text-rose-800">UK</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Community Spirit</p>
              </div>
            </div>
          </div>
          <img
            src="/images/about-us.png"
            alt="Warwickshire Sarbojonin community gathering"
            className="h-full max-h-[520px] w-full object-cover shadow-xl"
          />
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700">Festival experience</p>
            <h2 className="mt-3 text-4xl font-extrabold text-rose-950">Everything that makes Puja feel alive.</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {festivalHighlights.map((highlight) => {
              const HighlightIcon = highlight.icon;

              return (
                <article key={highlight.title} className="border border-amber-200 bg-amber-50 p-6 shadow-sm">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center bg-rose-700 text-white">
                    <HighlightIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-rose-950">{highlight.title}</h3>
                  <p className="mt-3 leading-7 text-gray-700">{highlight.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-rose-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-300">Festival days</p>
              <h2 className="mt-3 text-4xl font-extrabold">Sharadotsav highlights</h2>
              <p className="mt-4 max-w-2xl text-white/75">
                Three days of worship, cultural programs, food, friendship, and festive memories.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 bg-amber-300 px-5 py-3 font-bold text-rose-950 transition hover:bg-amber-200"
            >
              <CalendarDays className="h-5 w-5" />
              Full Schedule
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {eventCards.map((event) => (
            <article key={event.title} className="overflow-hidden bg-white text-gray-900 shadow-lg">
              <img src={event.imageSrc} alt={event.title} className="h-56 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-extrabold text-rose-950">{event.title}</h3>
                <p className="mt-2 text-gray-600" dangerouslySetInnerHTML={{ __html: event.dateHtml }} />
              </div>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700">Venue</p>
            <h2 className="mt-3 text-4xl font-extrabold text-rose-950">Celebrate with us in Warwickshire.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              Join the community at Weston-Under-Weatherly Village Hall for a warm, family-friendly Durga Puja
              celebration shaped by devotion, art, and shared memories.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/location"
                className="inline-flex items-center justify-center gap-2 bg-rose-700 px-6 py-3 font-bold text-white transition hover:bg-rose-800"
              >
                <MapPin className="h-5 w-5" />
                See Location
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-rose-700 px-6 py-3 font-bold text-rose-800 transition hover:bg-rose-50"
              >
                <HeartHandshake className="h-5 w-5" />
                Get Involved
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/gallery/image-1.png" alt="Durga Puja gallery moment" className="h-72 w-full object-cover shadow-md" />
            <img src="/gallery/image-3.png" alt="Festival decoration" className="mt-10 h-72 w-full object-cover shadow-md" />
          </div>
        </div>
      </section>

      <section className="bg-amber-50 px-6 py-16">
        <div className="mx-auto mb-10 max-w-6xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700">Gallery</p>
          <h2 className="mt-3 text-4xl font-extrabold text-rose-950">Moments from the celebration</h2>
        </div>
        <div className="mx-auto max-w-6xl">
          <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
            <GalleryCarousel images={galleryImages} />
          </LightGallery>
        </div>
      </section>
    </main>
  );
}
