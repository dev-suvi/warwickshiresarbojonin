// pages/events.jsx
export default function EventsPage() {
  const eventCards = [
    {
      title: 'Sasthi',
      dateHtml: '26<sup>th</sup> Sep 2025, Friday',
      time: '6:00 PM – 10:00 PM',
      venue: 'Weston-Under-Weatherly Village Hall',
      imageSrc: '/events/event1.jpg',
    },
    {
      title: 'Saptami & Asthami',
      dateHtml: '27<sup>th</sup> Sep 2025, Saturday',
      time: '9:00 AM – 10:00 PM',
      venue: 'Weston-Under-Weatherly Village Hall',
      imageSrc: '/events/event2.jpg',
    },
    {
      title: 'Nabami & Dashami',
      dateHtml: '28<sup>th</sup> Sep 2025, Sunday',
      time: '9:00 AM – 6:00 PM',
      venue: 'Weston-Under-Weatherly Village Hall',
      imageSrc: '/events/event3.jpg',
    },
  ];

  const programs = [
    { title: 'Opening Ceremony & Agomoni', time: '26 Sep, 7:00 PM', imageSrc: '/images/cultural/agomoni.jpg', description: 'Traditional welcome with dhak, conch, and chorus.' },
    { title: 'Children’s Cultural Showcase', time: '27 Sep, 3:30 PM', imageSrc: '/images/cultural/kids.jpg', description: 'Dance, music, and poetry by our young stars.' },
    { title: 'Star Evening', time: '27 Sep, 7:30 PM', imageSrc: '/images/cultural/star-evening.jpg', description: 'Guest performers and community fusion band.' },
    { title: 'Dhunchi & Sindoor Khela', time: '28 Sep, 4:00 PM', imageSrc: '/images/cultural/dhunchi.jpg', description: 'Traditional celebrations to bid farewell.' },
  ];

  const magazines = [
    { year: '2025', coverSrc: '/magazine/2025-cover.jpg', pdfSrc: '/magazine/2025.pdf', description: 'Sharodiya 2025 — essays, poems, and memories.' },
    { year: '2024', coverSrc: '/magazine/2024-cover.jpg', pdfSrc: '/magazine/2024.pdf', description: 'Sharodiya 2024 — a throwback to our journey.' },
  ];

  return (
    <main className="text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-b from-rose-600 to-rose-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Our Events</h1>
          <p className="mt-3 text-lg text-white/90">
            Event calendar, cultural programs, and our annual magazine.
          </p>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="#calendar" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">Event Calendar</a>
            <a href="#cultural" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">Cultural Programs</a>
            <a href="#magazine" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">Magazine</a>
          </div>
        </div>
      </section>

      {/* Sticky sub-nav */}
      <div className="sticky top-16 z-30 bg-amber-50/80 backdrop-blur supports-[backdrop-filter]:bg-amber-50/60 border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-4 overflow-x-auto py-3 text-sm">
            <a href="#calendar" className="rounded-full bg-amber-200 px-3 py-1.5 font-semibold text-rose-900 hover:bg-amber-300">Calendar</a>
            <a href="#cultural" className="rounded-full bg-amber-200 px-3 py-1.5 font-semibold text-rose-900 hover:bg-amber-300">Cultural</a>
            <a href="#magazine" className="rounded-full bg-amber-200 px-3 py-1.5 font-semibold text-rose-900 hover:bg-amber-300">Magazine</a>
          </nav>
        </div>
      </div>

      {/* Event Calendar */}
      <section id="calendar" className="scroll-mt-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-rose-900">Event Calendar</h2>
            <p className="mt-2 text-gray-600">Key dates and times for Sharadotsav 2025.</p>
            <div className="mt-4">
              <a href="/schedule.pdf" className="inline-flex items-center justify-center rounded-lg bg-rose-700 px-4 py-2 text-white font-semibold hover:bg-rose-800">
                Download Full Schedule (PDF)
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventCards.map((event) => (
              <article key={event.title} className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl ring-1 ring-amber-200 shadow-sm overflow-hidden">
                <img
                  src={event.imageSrc}
                  alt={event.title}
                  className="h-44 w-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/images/placeholders/event.jpg'; }}
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-rose-900">{event.title}</h3>
                  <p className="mt-1 text-gray-700" dangerouslySetInnerHTML={{ __html: event.dateHtml }} />
                  <p className="mt-1 text-sm text-rose-700">{event.time}</p>
                  <p className="mt-2 text-sm text-gray-500">{event.venue}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Programs */}
      <section id="cultural" className="scroll-mt-24 bg-gradient-to-b from-amber-50 to-amber-100">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-rose-900">Cultural Programs</h2>
            <p className="mt-2 text-gray-600">Performances and rituals throughout the festival.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program) => (
              <article key={program.title} className="rounded-2xl bg-white ring-1 ring-amber-200 shadow-sm overflow-hidden">
                <img
                  src={program.imageSrc}
                  alt={program.title}
                  className="h-40 w-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/images/placeholders/cultural.jpg'; }}
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-rose-900">{program.title}</h3>
                  <p className="mt-1 text-sm text-rose-700">{program.time}</p>
                  <p className="mt-2 text-sm text-gray-600">{program.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a href="/contact" className="inline-flex items-center justify-center rounded-full bg-rose-700 px-6 py-3 text-white font-semibold hover:bg-rose-800">
              Propose a Performance
            </a>
          </div>
        </div>
      </section>

      {/* Magazine */}
      <section id="magazine" className="scroll-mt-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-rose-900">Magazine</h2>
            <p className="mt-2 text-gray-600">Read our annual Sharodiya magazine.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {magazines.map((magazine) => (
              <article key={magazine.year} className="rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 ring-1 ring-amber-200 shadow-sm overflow-hidden">
                <img
                  src={magazine.coverSrc}
                  alt={`Sharodiya ${magazine.year} cover`}
                  className="h-64 w-full object-cover"
                  onError={(e) => { e.currentTarget.src = '/images/placeholders/magazine.jpg'; }}
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-rose-900">Sharodiya {magazine.year}</h3>
                  <p className="mt-2 text-sm text-gray-600">{magazine.description}</p>
                  <div className="mt-4 flex gap-3">
                    <a
                      href={magazine.pdfSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-rose-700 px-4 py-2 text-white text-sm font-semibold hover:bg-rose-800"
                    >
                      View PDF
                    </a>
                    <a
                      href={magazine.pdfSrc}
                      download
                      className="inline-flex items-center justify-center rounded-lg bg-amber-200 px-4 py-2 text-rose-900 text-sm font-semibold hover:bg-amber-300"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center text-gray-600">
            Want to contribute writing or art?{' '}
            <a href="/contact" className="text-rose-700 font-semibold hover:underline">Get in touch</a>.
          </div>
        </div>
      </section>
    </main>
  );
}
