// pages/about.jsx
export default function AboutPage() {
  return (
    <main className="text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-b from-rose-600 to-rose-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">About Us</h1>
          <p className="mt-3 text-lg text-white/90">
            Celebrating culture, community, and togetherness in Warwickshire.
          </p>

          {/* In-page quick links */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="#who-we-are" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">
              Who We Are
            </a>
            <a href="#committee" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20">
              Committee
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
                <strong>Warwickshire Sarbojonin</strong> is a community-led cultural association dedicated to
                celebrating the richness of Indian heritage through festivals, arts, and social initiatives.
                We bring families, friends, and well-wishers together to create meaningful experiences—
                from Durga Puja and cultural programs to charity drives and kids’ workshops.
              </p>
              <p className="mt-4 leading-relaxed">
                Our mission is simple: <em>inclusion, continuity, and joy</em>. We welcome everyone to participate,
                volunteer, and help shape a vibrant space for the community in Warwickshire and beyond.
              </p>
            </div>

            {/* Image */}
            <div className="relative">
              <img
                src="/images/about/celebration.jpg"
                alt="Community celebrating together"
                className="w-full rounded-3xl shadow-xl ring-1 ring-black/5 object-cover"
              />
              <div className="pointer-events-none absolute -z-10 -bottom-6 -right-6 h-40 w-40 rounded-full bg-amber-200/70 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Committee */}
      <section id="committee" className="scroll-mt-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-rose-900">Committee</h2>
            <p className="mt-2 text-gray-600">Meet the team that keeps everything running smoothly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'A. Mukherjee', role: 'President',         img: '/images/committee/president.jpg'  },
              { name: 'S. Banerjee',  role: 'General Secretary', img: '/images/committee/secretary.jpg'  },
              { name: 'R. Ghosh',     role: 'Treasurer',         img: '/images/committee/treasurer.jpg'  },
              { name: 'D. Chatterjee',role: 'Cultural Lead',     img: '/images/committee/cultural.jpg'   },
            ].map(m => (
              <div key={m.name} className="rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100 p-5 ring-1 ring-amber-200 shadow-sm">
                <img src={m.img} alt={m.role} className="h-40 w-full object-cover rounded-xl" />
                <h3 className="mt-4 text-lg font-semibold">{m.name}</h3>
                <p className="text-sm text-gray-600">{m.role}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-3xl mx-auto text-center text-gray-600">
            We are supported by passionate volunteers who help with logistics, decorations, hospitality,
            and cultural programming. Want to contribute?{' '}
            <a href="/contact" className="text-rose-700 font-semibold hover:underline">Get in touch</a>.
          </div>
        </div>
      </section>
    </main>
  );
}
