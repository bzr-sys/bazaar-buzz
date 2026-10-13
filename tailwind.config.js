/* eslint-env node */

// Colours are CSS variables (see src/assets/main.scss) so one set of classes
// works for both the light and the dark theme.
const themeColor = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        page: themeColor("page"),
        surface: themeColor("surface"),
        subtle: themeColor("subtle"),
        line: themeColor("line"),
        "line-strong": themeColor("line-strong"),
        ink: themeColor("ink"),
        body: themeColor("body"),
        muted: themeColor("muted"),
        honey: themeColor("honey"),
        "on-honey": themeColor("on-honey"),
        "honey-text": themeColor("honey-text"),
        "honey-soft": themeColor("honey-soft"),
        "honey-disabled": themeColor("honey-disabled"),
        "on-honey-disabled": themeColor("on-honey-disabled"),
        inverse: themeColor("inverse"),
        "on-inverse": themeColor("on-inverse"),
        danger: themeColor("danger"),
        "danger-soft": themeColor("danger-soft"),
        "danger-line": themeColor("danger-line"),
        backdrop: themeColor("backdrop"),
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
