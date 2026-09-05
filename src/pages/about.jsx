// pages/about.jsx
export default function AboutPage() {
  return (
    <main className="text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#5d0b1f] via-[#7c1830] to-[#c15a46] text-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20 text-center">
          <h1 className="mt-4 text-4xl sm:text-5xl font-black">About Warwickshire Sarbojonin</h1>
          <p className="mt-4 max-w-2xl mx-auto text-base text-rose-50/90 sm:text-lg">
            A vibrant socio-cultural forum and open platform rooted in the heart of Warwickshire.
          </p>

          {/* In-page quick links */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="#who-we-are" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">
              Who We Are
            </a>
            <a href="#objective" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">
              Objective
            </a>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section id="who-we-are" className="scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-rose-900">Who We Are</h2>
              <p className="mt-4 leading-relaxed">
                <strong>Warwickshire Sarbojonin</strong> is a young and vibrant Indian Cultural Organisation formed in 2025 with the vision of bringing the essence of Indian culture and heritage to the heart of Warwickshire, United Kingdom. Founded by 12 enthusiastic Bengali families, the organisation was born out of a shared desire to create a local cultural home - one that celebrates tradition, fosters unity, and strengthens the sense of belonging among the diaspora community. What truly sets Warwickshire Sarbojonin apart is its commitment to preserving heritage in meaningful, hands-on ways. The organisation strives to create immersive cultural experiences that honour age-old traditions while engaging the modern Indian community in the region.
              </p>
              <p className="mt-4 leading-relaxed">
                Looking ahead, Warwickshire Sarbojonin aims to grow as a long-term cultural hub - nurturing traditions, inspiring future generations, and strengthening social connections among the expanding Indian community in Warwickshire.
              </p>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src="/images/about/who-we-are.jpg"
                alt="Community celebrating together"
                className="w-full rounded-3xl shadow-xl ring-1 ring-black/5 object-cover"
              />
              <div className="pointer-events-none absolute -z-10 -bottom-6 -right-6 h-40 w-40 rounded-full bg-amber-200/70 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Objective */}
       <section id="objective" className="scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-rose-900">Objective</h2>
              <p className="mt-4 leading-relaxed">
               The objective of Warwickshire Sarbojonin is to promote and preserve the rich cultural heritage of India by curating meaningful artistic and community-led experiences. Through performing arts, music, dance, visual arts, and festive celebrations, the organisation seeks to foster cultural awareness, appreciation, and pride among people of all backgrounds.
              </p>
              <p className="mt-4 leading-relaxed">
                Warwickshire Sarbojonin is committed to supporting artists, nurturing creative expression, and delivering educational initiatives that engage, inspire, and enrich the wider UK community. In doing so, it aims to serve as a vibrant cultural hub— strengthening connections, celebrating diversity, and ensuring that India’s timeless traditions continue to flourish for future generations.
              </p>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src="/images/about/objective.jpg"
                alt="Community celebrating together"
                className="w-full rounded-3xl shadow-xl ring-1 ring-black/5 object-cover"
              />
              <div className="pointer-events-none absolute -z-10 -bottom-6 -right-6 h-40 w-40 rounded-full bg-amber-200/70 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
