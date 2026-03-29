/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f5f4',
          100: '#e8e6e3',
          200: '#d7d3cd',
          300: '#bbb5ab',
          400: '#a29886',
          500: '#887a6a',
          600: '#776a5c',
          700: '#625548',
          800: '#514639',
          900: '#433b30',
          950: '#2a261e',
        },
        secondary: {
          50: '#f9f7f5',
          100: '#f3efe9',
          200: '#e7e0d5',
          300: '#d8c9b6',
          400: '#c5ad93',
          500: '#b69477',
          600: '#a88064',
          700: '#8c6851',
          800: '#735445',
          900: '#5f473a',
          950: '#32241d',
        },
        luxury: {
          gold: '#D6C6A5',    // Muted gold/taupe
          silver: '#C8C8C8',  // Soft silver
          platinum: '#E5E4E2', // Light platinum
          charcoal: '#3A3A3A', // Soft charcoal
          midnight: '#2E2E3A', // Muted dark blue/gray
          cream: '#F5F2E9',   // Soft cream
          burgundy: '#6E4B4B', // Muted burgundy
          sage: '#B3B6A5',    // Sage green
          taupe: '#8A7F71',   // Taupe
          pearl: '#F0EAD6',   // Unchanged
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 4px 14px 0 rgba(0, 0, 0, 0.15)',
        'luxury-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}