import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vezner.net',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/legal/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === 'https://vezner.net/') {
          item.changefreq = 'monthly';
          item.priority = 1.0;
        }
        if (item.url.includes('/servicios/')) {
          item.changefreq = 'monthly';
          item.priority = 0.9;
        }
        if (item.url.includes('/blog')) {
          item.changefreq = 'weekly';
          item.priority = 0.8;
        }
        return item;
      }
    })
  ],
  vite: {
    ssr: {
      noExternal: ['gsap', 'lenis', 'three']
    }
  }
});