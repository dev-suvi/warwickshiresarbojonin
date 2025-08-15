import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';

export default function Footer() {
  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Link row with separators */}
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px]">
          {/* <Link href="/terms" className="hover:text-[#f3d4a1] transition">Terms &amp; conditions</Link>
          <span className="opacity-40">|</span>
          <Link href="/privacy" className="hover:text-[#f3d4a1] transition">Privacy Policy</Link>
          <span className="opacity-40">|</span> */}
          <Link href="/location" className="hover:text-[#f3d4a1] transition">Location</Link>
          <span className="opacity-40">|</span>
          <Link href="/contact" className="hover:text-[#f3d4a1] transition">Contact Us</Link>
          {/* <span className="opacity-40">|</span> */}
          {/* <Link href="/member-login" className="hover:text-[#f3d4a1] transition">Member Login</Link>
          <span className="opacity-40">|</span>
          <Link href="/join" className="hover:text-[#f3d4a1] transition">Join our family</Link> */}
        </nav>

        {/* Social icons in outlined circles */}
        <div className="mt-6 flex items-center gap-6">
          <a href="https://facebook.com/yourpage" target="_blank" rel="noopener noreferrer"
             aria-label="Facebook"
             className="h-14 w-14 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white/60 transition">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener noreferrer"
             aria-label="Instagram"
             className="h-14 w-14 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white/60 transition">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer"
             aria-label="Twitter"
             className="h-14 w-14 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white/60 transition">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="https://youtube.com/@yourchannel" target="_blank" rel="noopener noreferrer"
             aria-label="YouTube"
             className="h-14 w-14 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 hover:border-white/60 transition">
            <Youtube className="h-6 w-6" />
          </a>
        </div>

        {/* Divider */}
        <hr className="my-8 border-white/20" />

        {/* Bottom row with copyright + back-to-top */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/70">
            &copy; {new Date().getFullYear()} Warwickshire Sarbojonin, all rights reserved.
          </p>

          <button
            onClick={goTop}
            aria-label="Back to top"
            className="h-12 w-12 rounded-full border-2 border-[#e11d48] text-[#e11d48] flex items-center justify-center hover:bg-[#e11d48] hover:text-white transition"
            title="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
