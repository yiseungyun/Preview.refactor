/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grayscale: {
          'white-alt': 'rgba(255, 255, 255, 0.7)',
          white: '#FFFFFF',
          50: '#F5F7F9',
          100: '#D2DAE0',
          200: '#879298',
          300: '#6E8091',
          400: '#5F6E76',
          500: '#4B5966',
          black: '#14212B',
        },
        primary: {
          light: {
            DEFAULT: '#e6f9f1',    // rgb(230, 249, 241)
            hover: '#d9f5e9',      // rgb(217, 245, 233)
            active: '#b0ebd2',     // rgb(176, 235, 210)
          },
          DEFAULT: '#01bf6f',      // rgb(1, 191, 111)
          hover: '#01ac64',        // rgb(1, 172, 100)
          active: '#019959',       // rgb(1, 153, 89)
          dark: {
            DEFAULT: '#018f53',    // rgb(1, 143, 83)
            hover: '#017343',      // rgb(1, 115, 67)
            active: '#005632',     // rgb(0, 86, 50)
          },
          darker: '#004327',       // rgb(0, 67, 39)
        },
        accent: {
          gray: {
            DEFAULT: '#dfddd5'
          }
        }
      },
      borderColor: {
        skin: {
          bold: 'var(--color-border-bold)',
          default: 'var(--color-border-default)',
        },
      },
      fontSize: {
        // Bold(700) sizes
        'bold-l': ['32px', { lineHeight: 'auto', fontWeight: '700' }],
        'bold-m': ['28px', { lineHeight: 'auto', fontWeight: '700' }],
        'bold-r': ['20px', { lineHeight: 'auto', fontWeight: '700' }],

        // SemiBold(600) sizes
        'semibold-xl': ['28px', { lineHeight: 'auto', fontWeight: '600' }],
        'semibold-l': ['24px', { lineHeight: 'auto', fontWeight: '600' }],
        'semibold-m': ['22px', { lineHeight: 'auto', fontWeight: '600' }],
        'semibold-r': ['20px', { lineHeight: 'auto', fontWeight: '600' }],
        'semibold-s': ['18px', { lineHeight: 'auto', fontWeight: '600' }],

        // Medium(500) sizes
        'medium-xl': ['24px', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-l': ['22px', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-m': ['20px', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-r': ['18px', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-s': ['16px', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-xs': ['14px', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-xxs': ['12px', { lineHeight: 'auto', fontWeight: '500' }],
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

