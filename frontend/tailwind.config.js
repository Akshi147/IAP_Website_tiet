// tailwind.config.js
import tailwindcssTextShadow from 'tailwindcss-textshadow'; // Import the plugin

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      textShadow: {
        highlight: '2px 2px 0px black', // Creating a black border-like effect around the white text
      },
    },
  },
  plugins: [
    tailwindcssTextShadow, // Add the text-shadow plugin
  ],
};
