export default function robots() {
  // Replace with your actual deployed domain
  const baseUrl = 'https://ankurdev.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
