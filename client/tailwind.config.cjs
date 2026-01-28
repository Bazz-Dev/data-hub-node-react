module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF7000",
        background: "#FFFFFF",
        surface: "#FFFFFF",
        text: "#111827",
        muted: "#6B7280"
      },
      boxShadow: {
        soft: "0 8px 30px rgba(17,24,39,0.08)"
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ]
}
