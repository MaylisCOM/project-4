/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#F0E8BB',
        'lavender': '#E6E6FA',
        'olive': '#808000',
        'violet': '#8A2BE2',
        'dark-contrast': '#2D3748',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
      },
    },
  },
  plugins: [],
};
