module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}",],
  theme: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      negative: "var(--color-negative)",
      positive: "var(--color-positive)",
      "primary-background": "var(--background-primary)",
      "sec-background": "var(--background-sec)",
      "primary-text": "var(--color-text-primary)",
    },
  },
  backgroundColor: (theme) => ({
    ...theme("colors"),
  }),
  plugins: [
    require("tailwind-scrollbar")
  ],
}
