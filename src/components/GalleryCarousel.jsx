'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function GalleryCarousel({ images = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 2500, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const prev = () => emblaApi && emblaApi.scrollPrev();
  const next = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -mx-2">
          {images.map((src, i) => (
            <a key={i} href={src} className="px-2 basis-full sm:basis-1/2 lg:basis-1/3 shrink-0">
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-64 object-cover rounded shadow"
              />
            </a>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
      >
        ›
      </button>
    </div>
  );
}
