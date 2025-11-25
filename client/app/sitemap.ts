import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://varikliosala.lt';


const staticRoutes: { path: string; priority: number; changefreq: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: '/paslaugos', priority: 0.9, changefreq: 'weekly' },
  { path: '/galerija', priority: 0.7, changefreq: 'monthly' },
];


const serviceSlugs = [
  'diagnostika',
  '3d-ratu-suvedimas',
  'tepalu-keitimas',
  'vaziuokles-remontas',
  'stabdziu-remontas',
  'kebulo-remontas',
  'zibintu-remontas',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changefreq,
    priority: route.priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/paslaugos/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...serviceEntries];
}
