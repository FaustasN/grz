

import { Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 ">
          <Link href="/">
            <Image src="/transperent_logo.webp" alt="TireService Logo" width={150} height={150} />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="https://www.facebook.com/p/Variklio-sala-61581165962744/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 sm:h-11 items-center justify-center bg-gray-800 text-white px-3 sm:px-4 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            aria-label="Facebook"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Link>
          <Link
            href="tel:+37062444062"
            className="flex h-10 sm:h-11 items-center gap-2 bg-gray-800 text-white px-4 sm:px-6 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md text-sm sm:text-base font-semibold"
          >
            <Phone size={18} className="sm:hidden" />
            <Phone size={20} className="hidden sm:block" />
            <span className="hidden sm:inline">Skambinti</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
