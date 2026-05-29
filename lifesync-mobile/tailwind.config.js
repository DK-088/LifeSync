/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0A0118", // Deepest purple
        surface: "#1A0B2E",    // Card background
        primary: {
          DEFAULT: "#A855F7",  // Purple 500
          light: "#C084FC",
          dark: "#7E22CE",
        },
        accent: "#F472B6",     // Pink 400 for highlights
        muted: "#94A3B8",      // Slate 400
      },
      fontFamily: {
        outfit: ["Outfit_400Regular"],
        "outfit-bold": ["Outfit_700Bold"],
        "outfit-medium": ["Outfit_500Medium"],
      },
    },
  },
  plugins: [],
};
