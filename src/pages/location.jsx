export default function LocationPage() {
  return (
    <main className="bg-[#f8f1ea] px-6 py-16 text-gray-900">
      <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]" data-aos="fade-up">
        <div className="rounded-2xl bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
          <h2 className="text-4xl font-extrabold text-rose-950">Venue</h2>
          <div className="mt-6 overflow-hidden rounded-xl">
            <iframe
              className="h-[420px] w-full"
              src="https://www.google.com/maps?q=Weston%20Under%20Wetherley%20Hall%2C%20Warwickshire&z=14&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <aside className="rounded-2xl bg-[#fff7f2] p-8 shadow-[0_16px_40px_rgba(0,0,0,0.08)] ring-1 ring-rose-100">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose-700">Location details</p>
          <h3 className="mt-3 text-3xl font-extrabold text-rose-950">Venue</h3>

          <div className="mt-8 space-y-5 text-base leading-8 text-gray-700">
            <p>
              <span className="font-semibold text-rose-900">Weston-under-Wetherley Village Hall</span>
            </p>
            <p>
              Sabin Dr, Weston under Wetherley, Leamington Spa CV33 9GA, United Kingdom
            </p>
            <p>
              15 mins drive from Leamington Spa Rail Station
            </p>
            <p>
              15 mins drive from Coventry Rail Station
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
