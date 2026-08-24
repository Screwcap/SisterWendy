/** Declared once so metadataBase, robots.txt and sitemap.xml cannot disagree.
 *  layout.tsx had no metadataBase, so every og:image it declared was a relative
 *  URL — unresolvable by a social crawler. The 21 Aug audit also found this
 *  property's icon-1024.png 404ing. */
export const SITE_URL = 'https://sisterwendy.com';
