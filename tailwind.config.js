// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}', // For pages directory
    './components/**/*.{js,jsx,ts,tsx}', // For components directory
    './app/**/*.{js,jsx,ts,tsx}', // For app directory (if you're using Next.js or similar)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
