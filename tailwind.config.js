/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require("@iconify/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,ts,ts,jsx,tsx}",
  ],
  theme: {
  },
  plugins: [
    require('daisyui'),
    addDynamicIconSelectors()
  ],
}
