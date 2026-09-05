import { useEffect, useState } from 'react';
import Link from 'next/link';

import { getGalleryAlbum, getGalleryIndexData } from '../../../lib/galleryData';

export async function getStaticPaths() {
  const years = getGalleryIndexData();
  const paths = years.flatMap((year) =>
    year.groups.map((group) => ({
      params: {
        year: year.year,
        album: group.id,
      },
    }))
  );

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const album = getGalleryAlbum(params.year, params.album);

  return {
    props: {
      year: params.year,
      album,
    },
  };
}

export default function GalleryAlbumPage({ year, album }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const goToPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return 0;
      return (current - 1 + album.images.length) % album.images.length;
    });
  };

  const goToNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return 0;
      return (current + 1) % album.images.length;
    });
  };

  useEffect(() => {
    if (selectedIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null);
      }
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      }
      if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, album.images.length]);

  if (!album) {
    return null;
  }

  const currentImage = selectedIndex === null ? null : album.images[selectedIndex];

  return (
    <main className="bg-[#f8f3ee] text-gray-800">
      <section className="bg-gradient-to-br from-[#5d0b1f] via-[#7c1830] to-[#c15a46] text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-18">
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-rose-100/80">
            <Link href="/gallery">Gallery</Link>
            <span>/</span>
            <Link href={`/gallery/${year}`}>{year}</Link>
            <span>/</span>
            <span>{album.title}</span>
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">{album.title}</h1>
          <p className="mt-3 text-base text-rose-50/90">{album.imageCount} images in this collection.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-[#4f1022]">Album highlights</h2>
          <Link href={`/gallery/${year}`} className="rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800">
            Back to {year}
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {album.images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className="group block overflow-hidden rounded-[22px] border border-rose-100 bg-white text-left shadow-[0_10px_25px_rgba(112,34,50,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(112,34,50,0.13)]"
            >
              <img
                src={image}
                alt={`${album.title} ${index + 1}`}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </section>

      {selectedIndex !== null && currentImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close gallery"
              onClick={() => setSelectedIndex(null)}
              className="absolute -top-3 right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-2xl font-semibold text-[#4f1022] shadow-lg transition hover:bg-white"
            >
              ×
            </button>

            <div className="relative flex items-center justify-center">
              <button
                type="button"
                aria-label="Previous image"
                onClick={goToPrevious}
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-3xl text-[#4f1022] shadow-lg transition hover:bg-white"
              >
                ‹
              </button>

              <img
                src={currentImage}
                alt={`${album.title} ${selectedIndex + 1}`}
                className="max-h-[80vh] w-full rounded-2xl object-contain shadow-2xl"
              />

              <button
                type="button"
                aria-label="Next image"
                onClick={goToNext}
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-3xl text-[#4f1022] shadow-lg transition hover:bg-white"
              >
                ›
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 text-sm text-white/90">
              <span>{selectedIndex + 1}</span>
              <span>/</span>
              <span>{album.imageCount}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
