// pages/heritage.jsx
export default function HeritagePage() {
  return (
    <main className="text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-b from-rose-600 to-rose-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Heritage in Warwickshire</h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-white/90">
            Join Warwickshire Sarbojonin in embracing the vibrant culture of India through music, dance, arts,
            and community festivities. We support artists and enrich the UK community with educational and
            cultural events. Discover and celebrate the rich traditions with us!
          </p>

          <div className="mt-6">
            <a href="#offerings" className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold hover:bg-white/20">
              Explore Our Cultural Offerings
            </a>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section id="offerings" className="scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-rose-900">Our Cultural Offerings</h2>
            <p className="mt-2 text-gray-600">Programs that connect heritage with today’s community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visual Arts Exhibitions */}
            <article className="rounded-2xl bg-white ring-1 ring-amber-200 shadow-sm overflow-hidden">
              <img
                src="/images/heritage/visual-arts.jpg"
                alt="Visual arts exhibition"
                className="h-48 w-full object-cover"
                onError={(e) => { e.currentTarget.src = '/images/placeholders/heritage.jpg'; }}
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-rose-900">Visual Arts Exhibitions</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Explore the rich visual heritage of India via curated exhibitions displaying traditional and modern
                  art forms, including painting, sculpture, and crafts.
                </p>
              </div>
            </article>

            {/* Music Performances and Recitals */}
            <article className="rounded-2xl bg-white ring-1 ring-amber-200 shadow-sm overflow-hidden">
              <img
                src="/images/heritage/music.jpg"
                alt="Music performances and recitals"
                className="h-48 w-full object-cover"
                onError={(e) => { e.currentTarget.src = '/images/placeholders/heritage.jpg'; }}
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-rose-900">Music Performances &amp; Recitals</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Enjoy live performances showcasing Indian classical and contemporary music, featuring talented artists
                  from across the UK and India.
                </p>
              </div>
            </article>

            {/* Artist Support and Collaboration */}
            <article className="rounded-2xl bg-white ring-1 ring-amber-200 shadow-sm overflow-hidden">
              <img
                src="/images/heritage/artist-support.jpg"
                alt="Artist support and collaboration"
                className="h-48 w-full object-cover"
                onError={(e) => { e.currentTarget.src = '/images/placeholders/heritage.jpg'; }}
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-rose-900">Artist Support &amp; Collaboration</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We actively support Indian artists through collaborative projects, residencies, and showcases to
                  promote their work within the UK cultural landscape.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-12 text-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-rose-700 px-6 py-3 text-white font-semibold hover:bg-rose-800"
            >
              Partner with Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
