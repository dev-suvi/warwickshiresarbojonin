import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Menu, X, Plus, Minus,
  Facebook, Instagram, Twitter, Youtube
} from 'lucide-react';

// nav model (edit links/children as you like)
const NAV = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    children: [
      { label: 'Who We Are', href: '/about#who-we-are' },
      { label: 'Committee', href: '/about#committee' },
    ],
  },
  {
    label: 'Our Events',
    href: '/events',
    children: [
      { label: 'Event Calendar', href: '/events#calendar' },
      { label: 'Cultural Programs', href: '/events#cultural' },
      { label: 'Magazine', href: '/events#magazine' },
    ],
  },
  { label: 'Culture & Collaboration', href: '/heritage' },
  { label: 'Our Gallery', href: '/gallery' },
  { label: 'Location Map', href: '/location' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null); // index of expanded group

  // lock body scroll while menu open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', open);
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* Top header */}
      <header className="sticky top-0 bg-white shadow z-50">
        <div className="max-w-6xl mx-auto flex items-center p-4">
          <Link href="/" className="flex items-center">
            <img src="/images/logo.png" alt="Logo" className="h-14" />
          </Link>

          <h1 className="text-xl sm:text-2xl font-bold pl-4 text-red-800">
            Warwickshire Sarbojonin
          </h1>

          {/* desktop nav */}
          <nav className="ml-auto hidden sm:flex items-center gap-6 text-sm">
            <Link href="/">Home</Link>
            <Link href="/about">About us</Link>
            <Link href="/events">Events</Link>
            <Link href="/location">Location</Link>
          </nav>

          {/* mobile hamburger */}
          <button
            className="ml-auto sm:hidden inline-flex items-center justify-center rounded-md p-2"
            aria-label="Open menu"
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => setOpen(true)}
          >
            <Menu className="w-7 h-7 text-maroon" />
          </button>
        </div>
      </header>

      {/* Overlay + sliding drawer (mobile) */}
      <div
        className={`fixed inset-0 z-[60] sm:hidden ${open ? '' : 'pointer-events-none'}`}
      >
        {/* dim backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenu}
        />

        {/* drawer */}
        <aside
          className={`absolute left-0 top-0 h-full w-[100%] bg-white shadow-2xl
                      transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
          aria-hidden={!open}
        >
          <div className="flex flex-col h-full">
            {/* drawer header */}
            <div className="flex items-center justify-between p-4">
              <Link href="/" onClick={closeMenu} className="flex items-center">
                <img src="/images/logo.png" alt="Logo" className="h-16" />
              </Link>
              <button aria-label="Close menu" onClick={closeMenu} className="p-2 text-maroon">
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* nav list */}
            <nav className="px-4 py-2 space-y-4 overflow-y-auto">
              {NAV.map((item, idx) => {
                const hasChildren = Array.isArray(item.children) && item.children.length > 0;
                const expanded = openSection === idx;

                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="text-lg font-semibold"
                      >
                        {item.label}
                      </Link>

                      {hasChildren && (
                        <button
                          onClick={() => setOpenSection(expanded ? null : idx)}
                          aria-label={expanded ? 'Collapse section' : 'Expand section'}
                          className="p-2 -mr-2"
                        >
                          {expanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                      )}
                    </div>

                    {hasChildren && (
                      <div className={`mt-2 pl-6 space-y-3 ${expanded ? 'block' : 'hidden'}`}>
                        {item.children.map((ch) => (
                          <Link
                            key={ch.label}
                            href={ch.href}
                            onClick={closeMenu}
                            className="block uppercase tracking-wide text-gray-500"
                          >
                            {ch.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* socials + CTA at bottom */}
            <div className="mt-auto p-4">
              <div className="flex items-center gap-4 mb-6">
                <a
                  href="https://facebook.com/yourpage"
                  target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/yourhandle"
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
                  href="https://youtube.com/@yourchannel"
                  target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                  className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>

              {/* <Link
                href="/member-login"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-lg bg-[#264d99] px-5 py-3 text-white font-semibold shadow w-full"
              >
                MEMBER LOGIN <span className="ml-2">♥</span>
              </Link> */}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
