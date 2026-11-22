/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: '#121315',
        void: '#050505',
        'editorial-white': '#F2F2F2',
        'editorial-muted': '#858585',
        'editorial-subtle': '#404040',
        'ducati-red': '#d71920',
        // Design-system tokens from the Stitch project
        'surface-container-lowest': '#0d0e0f',
        'surface-container-low': '#1b1c1d',
        'surface-container': '#1f2021',
        'surface-container-high': '#292a2b',
        'surface-container-highest': '#343536',
        primary: '#ffb4ab',
        'primary-container': '#d71920',
        'on-primary-container': '#ffece9',
        secondary: '#c7c6c6',
        'secondary-container': '#464747',
        'on-surface': '#e3e2e3',
      },
      fontFamily: {
        headline: ['Syne', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'telemetry-xs': ['9px', { lineHeight: '12px', letterSpacing: '0.16em', fontWeight: '600' }],
        'telemetry-md': ['11px', { lineHeight: '16px', letterSpacing: '0.12em', fontWeight: '500' }],
        'headline-sm': ['20px', { lineHeight: '26px', letterSpacing: '0.02em', fontWeight: '600' }],
        'headline-md': ['28px', { lineHeight: '34px', letterSpacing: '0em', fontWeight: '700' }],
        'headline-lg': ['48px', { lineHeight: '52px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-sm': ['13px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '24px', letterSpacing: '0em', fontWeight: '400' }],
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
