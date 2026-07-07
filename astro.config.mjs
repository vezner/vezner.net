import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://vezner.net',
  integrations: [tailwind(), sitemap()],
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger', 'lenis', 'three']
    }
  }
});
