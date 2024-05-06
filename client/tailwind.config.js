/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        '::-webkit-scrollbar-track': '#FFFFFF'
      },
      scrollbarWidth: {
        thin: '1px', 
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwind-scrollbar')({
      nocompatible: true, 
      boxShadow: 'none', 
    }),
  ],
}