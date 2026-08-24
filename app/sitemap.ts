import type { MetadataRoute } from 'next';
import { SITE_URL } from './site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: Array<[string, number]> = [
    ['/', 1.0],
    ['/about', 0.6],
    ['/research', 0.5],
    ['/privacy', 0.3],
    ['/terms', 0.3],
  ];
  return pages.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: priority > 0.7 ? 'weekly' : 'yearly',
    priority,
  }));
}
