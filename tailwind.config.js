/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        square: "12.5%",
      },
      height: {
        square: "12.5%",
      },
      backgroundColor: {
        light: "#7DD3E2",
        dark: "#277ECE",
        "highlight-light": "#ff000044",
        "highlight-dark": "#ff000044",
        legal: "#00000022",
        "board-bg": "#0F508C",
        menu: "#312e2b",
        "btn-primary": "#81b64c",
        "btn-primary-hover": "#a1cf5f",
      },
      borderColor: {
        "highlight-light": "#ff000044",
        "highlight-dark": "#ff000044",
      },
      textColor: {
        coords: "#A4DBE7",
      },
    },
  },
  plugins: [],
};
