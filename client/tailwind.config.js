/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation:{
        spin: '1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      colors:{
        "accent": "#0000ff",
        "accent-hover": "#0000bb",
        "accent-alt": "#00bbff",
        "accent-alt-hover": "#00bbff",
      }
    },
  },
  plugins: [],
}

