/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        customGray: "#CECDC8", // The first custom color
        customDark: "#212121", // The second custom color
        customWhatsappGreen: "#2AB73E", // The third custom color
        customGrayB: "#CECDC8",
        // To add more custom colors here
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
        alexBrush: ["Alex Brush", "sans-serif"],
      },
    },
  },

  //   plugins:
  plugins: [],
};
