import Link from 'next/link';

import { getGalleryIndexData } from '../lib/galleryData';

export async function getStaticProps() {
  const galleryGroups = getGalleryIndexData().flatMap((yearData) =>
    yearData.groups.map((group) => ({
      title: group.title,
      href: `/gallery/${yearData.year}/${group.id}`,
      image: group.coverImage,
      count: group.imageCount,
    }))
  );

  return {
    props: {
      galleryGroups,
    },
  };
}

// pages/events.jsx
export default function EventsPage({ galleryGroups }) {
  const eventCards = [
    {
      title: 'Sasthi',
      dateHtml: '16<sup>th</sup> Oct 2026, Friday',
      time: '5:00 PM - 10:00 PM',
      imageSrc: '/events/event1.jpg',
    },
    {
      title: 'Saptami',
      dateHtml: '17<sup>th</sup> Oct 2026, Saturday',
      time: '9:00 AM - 10:00 PM',
      imageSrc: '/events/event2.jpg',
    },
    {
      title: 'Asthami',
      dateHtml: '18<sup>th</sup> Oct 2026, Sunday',
      time: '9:00 AM - 10:00 PM',
      imageSrc: '/events/event3.jpg',
    },
    {
      title: 'Nabami & Dashami',
      dateHtml: '18<sup>th</sup> Oct 2026, Sunday',
      time: '9:00 AM - 10:00 PM',
      imageSrc: '/events/event4.jpg',
    },
  ];

  return (
    <main className="text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#5d0b1f] via-[#7c1830] to-[#c15a46] text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 text-center">
          <h1 className="mt-4 text-4xl sm:text-5xl font-black">Our Events</h1>
          <p className="mt-4 max-w-2xl mx-auto text-base text-rose-50/90 sm:text-lg">
            Event Calendar, Our Events Gallery and Durga Pujo Annual Souvenir
          </p>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="#calendar" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">Event Calendar</a>
            <a href="#events-gallery" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">Events Gallery</a>
            <a href="#souvenir" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">Souvenir</a>
          </div>
        </div>
      </section>

      {/* Event Calendar */}
      <section id="calendar" className="scroll-mt-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-rose-900">Event Calendar</h2>
            <p className="mt-2 text-gray-600">Key dates and times for Sharadotsav 2026.</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a href="/events/programme-schedule" className="inline-flex items-center justify-center rounded-lg bg-rose-700 px-4 py-2 text-white font-semibold hover:bg-rose-800">
                Durga Puja Programme Schedule
              </a>
              <a href="/events/yearly-calendar" className="inline-flex items-center justify-center rounded-lg bg-rose-700 px-4 py-2 text-white font-semibold hover:bg-rose-800">
                Yearly Event Calendar
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {eventCards.map((event) => (
              <Link
                href="/events/programme-schedule"
                key={event.title}
                className="group block overflow-hidden rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 ring-1 ring-amber-200 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <article>
                  <img
                    src={event.imageSrc}
                    alt={event.title}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = '/images/placeholders/event.jpg'; }}
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-rose-900">{event.title}</h3>
                    <p className="mt-1 text-gray-700" dangerouslySetInnerHTML={{ __html: event.dateHtml }} />
                    <p className="mt-1 text-sm text-rose-700">{event.time}</p>
                    <p className="mt-2 text-sm text-gray-500">{event.venue}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Events Gallery */}
      <section id="events-gallery" className="scroll-mt-24 bg-[#f3f6f4]">
        <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-rose-900">Events Gallery</h2>
            <p className="mt-2 text-gray-600">Captured moments of celebration, vibrant performances, and community togetherness</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {galleryGroups.map((item) => (
              <Link
                href={item.href}
                key={`${item.href}`}
                className="group block overflow-hidden rounded-[24px] bg-[#f2f4f1] shadow-[0_8px_20px_rgba(30,30,30,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(30,30,30,0.10)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = '/gallery/image-1.png'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/35 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-[#f1e7d4]/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#2f130e] backdrop-blur-sm">
                    {item.count} photos
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-4">
                  <h3 className="text-[16px] font-extrabold text-[#4f1022]">{item.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm font-black text-[#4f1022] sm:text-base">
                    <span>Open album</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Souvenir */}
      <section id="souvenir" className="scroll-mt-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-rose-900">Souvenir</h2>
            <p className="mt-2 text-gray-600">A compact Durga Puja keepsake capturing the year’s devotion, memories and sponsorship advertisements.</p>
            <div className="mt-6 inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-5 py-2 text-base font-semibold text-rose-800">
              Launching Soon
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
