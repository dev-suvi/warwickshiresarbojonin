import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { CalendarDays, HeartHandshake, MapPin, Music, Sparkles, UtensilsCrossed, Users } from 'lucide-react';

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
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);

  useEffect(() => {
    let resetAnimationTimeoutId;
    let intervalId;

    const update = () => {
      const now = new Date();
      const millisecondsRemaining = target - now;

      if (millisecondsRemaining <= 0) {
        clearInterval(intervalId);
        setTimeRemaining(EMPTY_TIME_REMAINING);
        setIsCountdownComplete(true);
        setChangedUnits(UNCHANGED_TIME_UNITS);
        return;
      }

      setIsCountdownComplete(false);
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
    intervalId = setInterval(update, 1000);
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

  const isFinished = isCountdownComplete || Object.values(timeRemaining).every((value) => value === 0);

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
        {!isFinished ? (
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
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(null);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 640);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const galleryImages = [
    '/moments-from-the-celebration/542206550_122121418196955683_2898216149024399995_n.jpg',
    '/moments-from-the-celebration/547783223_122122906028955683_8460085079632912176_n.jpg',
    '/moments-from-the-celebration/548289947_122122909088955683_955951197977458953_n.jpg',
    '/moments-from-the-celebration/550772231_122125043252955683_5988397150487800803_n.jpg',
    '/moments-from-the-celebration/555670524_122126579612955683_6330195085308319756_n.jpg',
    '/moments-from-the-celebration/555739909_122127154190955683_3719518204172971372_n.jpg',
    '/moments-from-the-celebration/555945456_122126552654955683_382617406411383753_n.jpg',
    '/moments-from-the-celebration/557160857_122127555362955683_6453656724524839274_n.jpg',
    '/moments-from-the-celebration/557195670_122127584396955683_4840168155767066485_n.jpg',
    '/moments-from-the-celebration/557231741_122127296684955683_7512357231767573659_n.jpg',
    '/moments-from-the-celebration/557579661_122127559478955683_8326388880435688778_n.jpg',
    '/moments-from-the-celebration/558166353_122127558782955683_8739034321998892728_n.jpg',
    '/moments-from-the-celebration/559948246_122129799800955683_6321886016377943709_n.jpg',
  ];

  const visibleGalleryImages = Array.from({ length: isMobile ? 1 : 4 }, (_, offset) => {
    const index = (galleryStartIndex + offset) % galleryImages.length;
    return { image: galleryImages[index], index };
  });

  const goToPreviousGalleryImage = () =>
    setSelectedGalleryIndex((currentIndex) => {
      if (currentIndex === null) return 0;
      return (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    });

  const goToNextGalleryImage = () =>
    setSelectedGalleryIndex((currentIndex) => {
      if (currentIndex === null) return 0;
      return (currentIndex + 1) % galleryImages.length;
    });

  const goToPreviousGallerySlide = () => {
    setGalleryStartIndex((currentIndex) => (currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1));
  };

  const goToNextGallerySlide = () => {
    setGalleryStartIndex((currentIndex) => (currentIndex + 1) % galleryImages.length);
  };

  useEffect(() => {
    const autoRotateId = setInterval(() => {
      setGalleryStartIndex((currentIndex) => (currentIndex + 1) % galleryImages.length);
    }, 4000);

    return () => clearInterval(autoRotateId);
  }, [galleryImages.length]);

  useEffect(() => {
    if (selectedGalleryIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedGalleryIndex(null);
      }
      if (event.key === 'ArrowLeft') {
        goToPreviousGalleryImage();
      }
      if (event.key === 'ArrowRight') {
        goToNextGalleryImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGalleryIndex, galleryImages.length]);

  const eventCards = [
    { title: 'Sasthi', dateHtml: '16<sup>th</sup> Oct 2026, Friday', imageSrc: '/events/event1.jpg' },
    { title: 'Saptami', dateHtml: '17<sup>th</sup> Oct 2026, Saturday', imageSrc: '/events/event2.jpg' },
    { title: 'Ashtami', dateHtml: '18<sup>th</sup> Oct 2026, Sunday', imageSrc: '/events/event3.jpg' },
    { title: 'Nabomi & Dashami', dateHtml: '18<sup>th</sup> Oct 2026, Sunday', imageSrc: '/events/event4.jpg' },
  ];

  const festivalHighlights = [
    {
      title: 'Puja & Rituals',
      description: 'Traditional Worship, Arati, Pushpanjali moments, shared devotion across all festive days.',
      icon: Sparkles,
    },
    {
      title: 'Art, Music & Culture',
      description: 'Creative Art, thematic décor, handcrafted idol, music, adda and a pandal brought to life through colour, imagination, and community effort.',
      icon: Music,
    },
    {
      title: 'Bhog & Food',
      description: 'Aromatic bhog, typical Indian street food, traditional flavours, and the joy of sharing food that brings the community together.',
      icon: UtensilsCrossed,
    },
    {
      title: 'Community Connection',
      description: 'Warm welcomes, shared smiles, collective effort, and a community that comes together as one—strengthening bonds through every moment of the festival.',
      icon: Users,
    },
  ];

  return (
    <main className="text-gray-900">
      <section className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-[#efe9e1] text-white">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero-mobile.png" />
          <img
            src="/images/hero.png"
            alt="Durga Puja celebration"
            className="absolute inset-0 h-full w-full object-cover opacity-100"
          />
        </picture>

        <div className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
          <div className="max-w-5xl">
            <h1
              className="text-[clamp(2.2rem,4vw,4.6rem)] font-black leading-[0.9] tracking-[-0.05em] text-rose-950 drop-shadow-[0_2px_8px_rgba(255,255,255,0.55)]"
            >
              <span className="block">Warwickshire Sarbojonin</span>
              <span className="mt-2 block">Sharadotsav 2026</span>
            </h1>
            <div className="mx-auto mt-6 max-w-4xl rounded-xl border border-white/30 bg-[#f4efe9]/55 px-5 py-4 shadow-[0_10px_28px_rgba(24,18,17,0.08)] backdrop-blur-[1px]">
              <p className="text-base leading-8 text-[#2d2424]/90 sm:text-lg lg:text-[1.3rem]">
                <strong>Warwickshire Sarbojonin Sharadotsav 2026, where Maa Durgaarrives on a horse (Ghotok), bringing a burst of colour, rhythm, and community spirit. The pandal comes alive with dhaak beats, thematic decorations, joyful faces, and the warm aroma of bhog. Families, friends, and visitors from across the UK gather to celebrate culture, devotion, art, and togetherness - creating a festive atmosphere that feels both timeless and unforgettable.</strong> 
              </p>
            </div>
          </div>

          <div className="mt-12 w-full max-w-3xl">
            <Countdown
              date="2026-10-17T00:00:00"
              title="Sharadotsav 2026"
              subtitle="Warwickshire Sarbojonin Durga Puja Celebration Countdown"
            />
            <div className="mt-8 flex flex-row items-center justify-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 bg-amber-300 px-6 py-3 font-bold text-rose-950 transition hover:bg-amber-200"
              >
                <CalendarDays className="h-5 w-5" />
                Events
              </Link>
              <Link
                href="/location"
                className="inline-flex items-center justify-center gap-2 border border-[#f4efe9]/80 bg-[#f4efe9]/20 px-6 py-3 font-bold text-[#1d1817] shadow-[0_8px_22px_rgba(0,0,0,0.08)] backdrop-blur-[1px] transition hover:bg-[#f4efe9]/35"
              >
                <MapPin className="h-5 w-5" />
                Venue
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 px-6 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700">About Warwickshire Sarbojonin</p>
            <h2
              className="mt-3 text-4xl font-extrabold text-rose-950"
            >
              A vibrant socio-cultural forum
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-700">
              <strong>Warwickshire Sarbojonin</strong> is a young and vibrant Indian cultural organisation dedicated to bringing the essence of Indian heritage to the heart of Warwickshire.<br/> <br/>Founded with the desire to create a local cultural home, it celebrates tradition, fosters unity, and strengthens the sense of belonging within the diaspora. Committed to meaningful, hands-on preservation of heritage, the organisation creates immersive experiences that honour age-old customs while engaging the modern community. <br/> <br/>Looking ahead, Warwickshire Sarbojonin aims to grow into a long-term cultural hub—nurturing traditions, inspiring future generations, and deepening social connections across the expanding Indian community in Warwickshire.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="border-l-4 border-rose-700 bg-white p-4 shadow-sm">
                <p className="text-3xl font-extrabold text-rose-800">3</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Days Celebration</p>
              </div>
              <div className="border-l-4 border-amber-500 bg-white p-4 shadow-sm">
                <p className="text-3xl font-extrabold text-rose-800">All</p>
                <p className="mt-1 text-sm font-semibold text-gray-600">Community Welcome</p>
              </div>
              <div className="border-l-4 border-rose-700 bg-white p-4 shadow-sm">
                <p className="text-3xl font-extrabold text-rose-800">Festival</p>
                <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-gray-600">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-700" />
                  <span className="whitespace-nowrap">Dhaak</span>
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-700" />
                  <span className="whitespace-nowrap">Dance</span>
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-700" />
                  <span className="whitespace-nowrap">Bhog</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="/images/about-us.png"
              alt="Warwickshire Sarbojonin community gathering"
              className="w-full object-contain object-left"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700">Festival experience</p>
            <h2 className="mt-3 text-4xl font-extrabold text-rose-950">Everything that makes Puja feel alive</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
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

      <section className="bg-[#f6e9dc] px-6 py-16 text-[#2b1117]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700">Festival days</p>
              <h2 className="mt-3 text-4xl font-extrabold text-rose-950">Sharadotsav highlights</h2>
              <p className="mt-4 max-w-2xl text-[#4b2a2a]/80">
                Three days of worship, cultural programs, food, friendship, and festive memories.
              </p>
            </div>
            <Link
              href="/events/programme-schedule"
              className="inline-flex items-center justify-center gap-2 bg-amber-300 px-5 py-3 font-bold text-rose-950 transition hover:bg-amber-200"
            >
              <CalendarDays className="h-5 w-5" />
              Full Schedule
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {eventCards.map((event) => (
            <article key={event.title} className="overflow-hidden rounded-2xl bg-white text-gray-900 shadow-[0_12px_28px_rgba(94,20,33,0.08)] ring-1 ring-rose-100">
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

      <section className="bg-amber-50 px-6 py-16">
        <div className="mx-auto mb-10 max-w-6xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700">Gallery</p>
          <h2 className="mt-3 text-4xl font-extrabold text-rose-950">Moments from the celebration</h2>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <button
            type="button"
            aria-label="Previous gallery"
            onClick={goToPreviousGallerySlide}
            className="absolute -left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-rose-900 text-2xl text-white shadow-lg md:-left-5"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Next gallery"
            onClick={goToNextGallerySlide}
            className="absolute -right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-rose-900 text-2xl text-white shadow-lg md:-right-5"
          >
            ›
          </button>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {visibleGalleryImages.map(({ image, index }) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedGalleryIndex(index)}
                className="group overflow-hidden rounded-xl border border-rose-100 bg-[#f7f2ee] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                aria-label={`Open gallery image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Celebration moment ${index + 1}`}
                  className="h-52 w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedGalleryIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedGalleryIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setSelectedGalleryIndex(null)}
              className="absolute -top-3 right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-2xl font-semibold text-[#4f1022] shadow-lg"
            >
              ×
            </button>

            <div className="relative flex items-center justify-center">
              <button
                type="button"
                aria-label="Previous image"
                onClick={goToPreviousGalleryImage}
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-3xl text-[#4f1022] shadow-lg"
              >
                ‹
              </button>

              <img
                src={galleryImages[selectedGalleryIndex]}
                alt={`Celebration moment ${selectedGalleryIndex + 1}`}
                className="max-h-[80vh] w-full rounded-2xl object-contain shadow-2xl"
              />

              <button
                type="button"
                aria-label="Next image"
                onClick={goToNextGalleryImage}
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-3xl text-[#4f1022] shadow-lg"
              >
                ›
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 text-sm text-white/90">
              <span>{selectedGalleryIndex + 1}</span>
              <span>/</span>
              <span>{galleryImages.length}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
