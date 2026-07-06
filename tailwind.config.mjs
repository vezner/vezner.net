
export default {
  content: ['./src*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        negro: '#0a0a0a',
        blanco: '#FFFFFF',
        acento: '#ff3c00',
        verde: '#00c851',
        azul: '#0057ff',
        rosa: '#ff005c',
      },
      letterSpacing: {
        megawide: '0.35em',
        ultrawide: '0.5em',
      }
    },
  },
  plugins: [],
}
