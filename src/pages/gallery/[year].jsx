import Link from 'next/link';

import { getGalleryIndexData } from '../../lib/galleryData';

export async function getStaticPaths() {
  const years = getGalleryIndexData();

  return {
    paths: years.map((year) => ({ params: { year: year.year } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const yearData = getGalleryIndexData().find((item) => item.year === params.year) || null;

  return {
    props: {
      yearData,
    },
  };
}

export default function YearGalleryPage({ yearData }) {
  if (!yearData) {
    return null;
  }

  return (
    <main className="bg-[#f8f3ee] text-gray-800">
      <section className="bg-gradient-to-br from-[#5d0b1f] via-[#7c1830] to-[#c15a46] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-18">
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-rose-100/80">
            <Link href="/gallery">Gallery</Link>
            <span>/</span>
            <span>{yearData.title}</span>
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">{yearData.title} Event Gallery</h1>
          <p className="mt-3 max-w-2xl text-base text-rose-50/90">{yearData.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-[#4f1022]">Collections</h2>
          <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">
            {yearData.totalImages} images
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {yearData.groups.map((group) => (
            <Link href={`/gallery/${yearData.year}/${group.id}`} key={group.id} className="group block">
              <article className="overflow-hidden rounded-[26px] border border-rose-100 bg-white shadow-[0_16px_35px_rgba(112,34,50,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(112,34,50,0.14)]">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={group.coverImage}
                    alt={group.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b0c17]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                    {group.imageCount} photos
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-black text-[#4f1022]">{group.title}</h3>
                  <div className="mt-3 flex items-center justify-between text-sm font-semibold text-rose-700">
                    <span>Open album</span>
                    <span>→</span>
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
