import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Menu, X, Plus, Minus,
  Facebook, Instagram, Twitter, Youtube
} from 'lucide-react';

// nav model (edit links/children as you like)
const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Get Involved', href: '/contact' },
];

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedNavIndex, setExpandedNavIndex] = useState(null);

  // lock body scroll while menu open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isMobileMenuOpen);
    return () => document.body.classList.remove('overflow-hidden');
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Top header */}
      <header className="sticky top-0 z-50 bg-white shadow">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-2.5">
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.png" alt="Logo" className="h-11 w-auto shrink-0 object-contain" />
            </Link>
            <div className="flex min-w-0 flex-col leading-none">
              <h1 className="text-lg font-bold text-red-800 sm:text-xl">
                Warwickshire Sarbojonin
              </h1>
              <span className="mt-0.5 text-[9px] font-semibold tracking-wide text-gray-700">
                Registration No. : 16621105
              </span>
            </div>
          </div>

          {/* desktop nav */}
          <nav className="ml-auto hidden lg:flex items-center gap-2 text-sm font-semibold">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition ${
                    isActive
                      ? 'bg-[#7a1d1d] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-[#f7eadf] hover:text-[#7a1d1d]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* mobile hamburger */}
          <button
            className="ml-auto lg:hidden inline-flex items-center justify-center rounded-md p-2"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-7 h-7 text-maroon" />
          </button>
        </div>
      </header>

      {/* Overlay + sliding drawer (mobile) */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}
      >
        {/* dim backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMobileMenu}
        />

        {/* drawer */}
        <aside
          className={`absolute left-0 top-0 h-full w-[100%] bg-white shadow-2xl
                      transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="flex flex-col h-full">
            {/* drawer header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex flex-col items-center shrink-0">
                <Link href="/" onClick={closeMobileMenu} className="flex items-center">
                  <img src="/images/logo.png" alt="Logo" className="h-16 w-auto shrink-0 object-contain" />
                </Link>
                <span className="mt-1 text-[10px] font-semibold tracking-wide text-gray-700">
                  Registration No. : 16621105
                </span>
              </div>
              <button aria-label="Close menu" onClick={closeMobileMenu} className="p-2 text-maroon">
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* nav list */}
            <nav className="px-4 py-2 space-y-2 overflow-y-auto">
              {NAV_ITEMS.map((navItem) => {
                const isActive = router.pathname === navItem.href;

                return (
                  <Link
                    key={navItem.href}
                    href={navItem.href}
                    onClick={closeMobileMenu}
                    className={`block rounded-xl px-4 py-3 text-base font-semibold transition ${
                      isActive
                        ? 'bg-[#7a1d1d] text-white'
                        : 'text-gray-700 hover:bg-[#f7eadf] hover:text-[#7a1d1d]'
                    }`}
                  >
                    {navItem.label}
                  </Link>
                );
              })}
            </nav>

            {/* socials + CTA at bottom */}
            <div className="mt-auto p-4">
              <div className="flex items-center gap-4 mb-6">
                <a
                  href="https://www.facebook.com/share/18Tq25NbDk/?mibextid=wwXIfr"
                  target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/warwickshiresarbojonin2025?stkn=MTBiNHBzdzRoZmw2cg=="
                  target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/yourhandle"
                  target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                  className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@warwickshiresarbojonin?feature=shared"
                  target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
