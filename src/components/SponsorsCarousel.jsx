import { useId } from 'react';
import styles from './SponsorsCarousel.module.css';

export default function SponsorsCarousel({ sponsors = [] }) {
  const headingId = useId();
  const entries = sponsors.filter((sponsor) => sponsor.image && (sponsor.name || sponsor.alt));

  if (entries.length === 0) return null;

  const isAnimated = entries.length > 1;

  const renderGroup = (isDuplicate = false) => (
    <ul
      className={`${styles.group} ${isDuplicate ? styles.duplicate : ''}`}
      aria-hidden={isDuplicate ? true : undefined}
    >
      {entries.map((sponsor) => {
        const alt = sponsor.alt || `${sponsor.name} logo`;
        // Keep external links restricted to web URLs.
        const url = /^https?:\/\//i.test(sponsor.url || '') ? sponsor.url : null;
        const logo = (
          <img
            src={sponsor.image}
            alt={isDuplicate ? '' : alt}
            width="192"
            height="96"
            className="h-20 w-full object-contain sm:h-24"
            decoding="async"
          />
        );

        return (
          <li key={sponsor.id || sponsor.image} className={styles.item}>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isDuplicate ? -1 : undefined}
                aria-label={`${sponsor.name || alt} (opens in a new tab)`}
                className="block rounded-xl border border-rose-100 bg-white p-5 shadow-sm transition hover:border-rose-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              >
                {logo}
              </a>
            ) : (
              <div className="rounded-xl border border-rose-100 bg-white p-5 shadow-sm">{logo}</div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <section aria-labelledby={headingId} className="bg-[#fff7f2] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 id={headingId} className="text-3xl font-extrabold text-rose-950 sm:text-4xl">
            With Thanks to our Partners &amp; Supporters
          </h2>
        </div>
        <div className={`${styles.viewport} ${!isAnimated ? styles.static : ''}`}>
          <div
            className={styles.track}
            style={{ '--sponsor-duration': `${Math.max(24, entries.length * 5)}s` }}
          >
            {renderGroup()}
            {isAnimated && renderGroup(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
