/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'blood-red': '#8B0000',
        'field-green': '#2E7D32',
        'parchment': '#F5F5DC',
        'bronze': '#CD7F32',
        'dark-stone': '#2F2F2F',
      },
      fontFamily: {
        'medieval': ['serif'],
      },
    },
  },
  plugins: [],
}