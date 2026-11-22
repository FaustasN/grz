import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://autovaldika.lt';
export const SITE_NAME = 'Autovaldika';

export function buildMetadata({
  path,
  title,
  description,
  keywords,
  noindex,
}: {
  path: string;
  title: string;
  description: string;
  keywords?: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    keywords,
    robots: noindex ? 'noindex, follow' : 'index, follow',
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'lt_LT',
      type: 'website',
    },
  };
}

export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'Autovaldika',
  url: SITE_URL,
  telephone: '+37061881791',
  email: 'autovaldika@gmail.com',
  image: `${SITE_URL}/transperent_logo.webp`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jaunystės g. 11A',
    postalCode: 'LT-02236',
    addressLocality: 'Vilnius',
    addressCountry: 'LT',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  sameAs: ['https://www.facebook.com/profile.php?id=100065069947682'],
};
