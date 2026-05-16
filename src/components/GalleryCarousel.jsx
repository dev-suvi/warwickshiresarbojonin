'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function GalleryCarousel({ images = [] }) {
  const [carouselRef, carouselApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 2500, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const scrollToPreviousSlide = () => carouselApi?.scrollPrev();
  const scrollToNextSlide = () => carouselApi?.scrollNext();

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={carouselRef}>
        <div className="flex -mx-2">
          {images.map((imageSrc, imageIndex) => (
            <a key={imageSrc} href={imageSrc} className="px-2 basis-full sm:basis-1/2 lg:basis-1/3 shrink-0">
              <img
                src={imageSrc}
                alt={`Gallery ${imageIndex + 1}`}
                className="w-full h-64 object-cover rounded shadow"
              />
            </a>
          ))}
        </div>
      </div>

      <button
        onClick={scrollToPreviousSlide}
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
      >
        ‹
      </button>
      <button
        onClick={scrollToNextSlide}
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded"
      >
        ›
      </button>
    </div>
  );
}
