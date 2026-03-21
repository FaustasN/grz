import Link from 'next/link';
export default function Footer() {
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 sm:py-10 md:py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Kontaktai</h4>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400">
              <li>
                  <a href="tel:+37061881791" className="hover:text-white transition-colors">
                  +370 618 81791
                </a>
              </li>
              <li>
                <a href="mailto:autovaldika@gmail.com" className="hover:text-white transition-colors break-all">
                  autovaldika@gmail.com
                </a>
              </li>
              <li>Jaunystės g. 11A, LT-02236 Vilnius</li>
            </ul>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Nuorodos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#apie-mus" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  Apie mus
                </Link>
              </li>
              <li>
                <Link href="/paslaugos" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  Paslaugos
                </Link>
              </li>
              <li>
                <Link href="/#kontaktai" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  Kontaktai
                </Link>
              </li>
              <li>
                <Link href="/straipsniai" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  Straipsniai
                </Link>
              </li>
              <li>
                <Link href="https://rekvizitai.vz.lt/imone/autovaldika_uab_autoservisas/" className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors">
                  Rekvizitai
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-xs sm:text-sm">&copy; {currentYear} autovaldika.lt Visos teisės saugomos.</p>
        </div>
      </div>
    </footer>
  );
}
