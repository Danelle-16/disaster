module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        disaster: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          600: '#0284c7',
          900: '#0c2d6b',
        }
      }
    },
  },
  plugins: [],
}
