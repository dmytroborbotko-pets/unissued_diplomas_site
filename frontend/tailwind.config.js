/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'mobile-sm': '480px',    // Smaller Mobile: < 480px
      'mobile-lg': '481px',    // Larger Mobile: 481px-768px
      'tablet': '769px',       // Larger Tablets, Laptops: 769px-1279px
      'desktop': '1280px',     // Desktop: > 1280px
    },
    extend: {
      colors: {
        brand: {
          red: '#B91C1C', // Deep red for memorial theme
          black: '#0A0A0A',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
