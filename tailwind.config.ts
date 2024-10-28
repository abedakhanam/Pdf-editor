import { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensures Tailwind applies to files in src directory
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"), // Include the forms plugin here
  ],
} as Config;
