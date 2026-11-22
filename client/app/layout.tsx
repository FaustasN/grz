import type { Metadata } from "next";
import "./globals.css";
import { GoogleTagManager } from '@next/third-parties/google';
import { GoogleAnalytics } from '@next/third-parties/google'
import { SITE_URL, localBusinessJsonLd } from './lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Autovaldika – autoservisas Vaidotuose, Vilniuje",
  description:
    "Greitas ir patikimas automobilių servisas Vaidotuose: remontas, diagnostika, tepalų keitimas ir 3D ratų suvedimas. Skambinkite +370 618 81791",
  robots: "index, follow",
  icons: {
    icon: '/transperent_logo.webp',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt">
      <head>
          <GoogleAnalytics gaId={'G-Z4ZLMNNRDF'} />
         <GoogleTagManager gtmId={'GTM-KHZ67MT8'} /> 
      </head>
      <body className="antialiased bg-white text-gray-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
    </html>
  );
}

