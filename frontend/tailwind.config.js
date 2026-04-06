/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C4A18A',
        'primary-hover': '#A8856F',
        secondary: '#FCE4EC',
        'secondary-hover': '#F4C2D3',
        'bg-main': '#FAF9F6',
        'surface-card': '#FFFFFF',
        'text-primary': '#1A1A1A',
        'text-secondary': '#5C5C5C',
        'border-light': '#EAE5E0',
        'badge-new': '#1A1A1A',
        'badge-promo': '#C4A18A',
        'badge-low-stock': '#D9534F',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
