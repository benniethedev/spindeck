module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/globals.css",
  ],
  theme: {
    extend: {
      colors: {
        'spindeck-red': '#FF3C3C',
        'spindeck-black': '#000000',
        'spindeck-dark': '#1A1A1A',
        'spindeck-gray': '#CCCCCC',
        // Cinematic Sonic palette (DESIGN.md)
        'void': '#050505',
        'stage': '#0E0E0E',
        'deck': '#141414',
        'surface-dim': '#131313',
        'surface-bright': '#3a3939',
        'surface-low': '#1c1b1b',
        'surface-lowest': '#0e0e0e',
        'surface-high': '#2a2a2a',
        'surface-highest': '#353534',
        'surface-variant': '#353534',
        'surface-card': '#141414',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#e7bdb7',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B3B3B3',
        'on-background': '#e5e2e1',
        'primary': '#ffb4aa',
        'on-primary': '#690003',
        'primary-container': '#ff5545',
        'on-primary-container': '#5c0002',
        'secondary': '#ffb4a3',
        'on-secondary': '#630f00',
        'secondary-container': '#a92100',
        'on-secondary-container': '#ffbeaf',
        'tertiary': '#ffb4a2',
        'on-tertiary': '#621100',
        'tertiary-container': '#e96a4a',
        'on-tertiary-container': '#560e00',
        'outline': '#ad8883',
        'outline-variant': '#5d3f3b',
        'border-subtle': 'rgba(255,255,255,0.08)',
        'glow-accent': 'rgba(255,80,50,0.35)',
        'thermal-start': '#FF3B30',
        'thermal-end': '#FF7A59',
      },
      backgroundImage: {
        gradient:
          "linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)",
      },
      animation: {
        opacity: "opacity 0.25s ease-in-out",
        appearFromRight: "appearFromRight 300ms ease-in-out",
        wiggle: "wiggle 1.5s ease-in-out infinite",
        popup: "popup 0.25s ease-in-out",
        shimmer: "shimmer 3s ease-out infinite alternate",
      },
      keyframes: {
        opacity: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        appearFromRight: {
          "0%": { opacity: 0.3, transform: "translate(15%, 0px);" },
          "100%": { opacity: 1, transform: "translate(0);" },
        },
        wiggle: {
          "0%, 20%, 80%, 100%": {
            transform: "rotate(0deg)",
          },
          "30%, 60%": {
            transform: "rotate(-2deg)",
          },
          "40%, 70%": {
            transform: "rotate(2deg)",
          },
          "45%": {
            transform: "rotate(-4deg)",
          },
          "55%": {
            transform: "rotate(4deg)",
          },
        },
        popup: {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "0 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [],
};
