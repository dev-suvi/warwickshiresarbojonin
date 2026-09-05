import Link from 'next/link';

import { getGalleryIndexData } from '../../lib/galleryData';

export async function getStaticProps() {
  return {
    props: {
      years: getGalleryIndexData(),
    },
  };
}

export default function GalleryLandingPage({ years = [] }) {
  return (
    <main className="bg-[#f8f3ee] text-gray-800">
      <section className="bg-gradient-to-br from-[#5d0b1f] via-[#7c1830] to-[#c15a46] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Celebrations through the years</h1>
          <p className="mt-4 max-w-2xl text-base text-rose-50/90 sm:text-lg">
            Browse our community memories year by year and explore each event collection in a structured gallery experience.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {years.map((year) => (
            <Link href={`/gallery/${year.year}`} key={year.year} className="group block">
              <article className="overflow-hidden rounded-[30px] border border-rose-100 bg-white shadow-[0_18px_45px_rgba(112,34,50,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(112,34,50,0.18)]">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={year.groups[0]?.coverImage || '/gallery/image-1.png'}
                    alt={`${year.title} gallery`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b0c17]/70 via-[#2b0c17]/20 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
                    {year.title}
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-black text-[#4f1022]">{year.title}</h2>
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
                      {year.groups.length} groups
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-gray-600">{year.description}</p>

                  <div className="flex items-center justify-between border-t border-rose-100 pt-4 text-sm font-semibold text-rose-700">
                    <span>{year.totalImages} images</span>
                    <span>Explore →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
