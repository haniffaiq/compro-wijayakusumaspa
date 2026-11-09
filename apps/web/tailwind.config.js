/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F4EF',
        ink: '#1B1712',
        muted: '#5B5248',
        'muted-inv': '#BBB0A0',
        line: '#DED7CB',
        clay: '#A64D29',
        'clay-deep': '#7E3B1F',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      maxWidth: { content: '1400px' },
      borderRadius: { DEFAULT: '2px', sm: '2px' },
      letterSpacing: { label: '0.18em' },
    },
  },
};
