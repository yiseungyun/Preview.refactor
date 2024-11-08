/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          white: '#FFFFFF',
          50: '#FAFAFA',
          100: '#EDEDED',
          200: '#E1E1E1',
          300: '#D9D9D9',
          400: '#6C6C6C',
          500: '#5E5E5E',
          600: '#3F3F3F',
          black: '#171717',
        },
        green: {
          50: '#F1FBF7',
          100: '#01BF6F',
          200: '#01AC64',
          300: '#019959',
          400: '#018F53',
          500: '#017343',
          600: '#005632',
          700: '#004327'  
        },
        point: {
          1: '#F04040',
          2: '#DFDDD5',
          3: '#2572E6'
        }
      },
      fontSize: {
        // Bold(700) sizes
        'bold-l': ['30px', { lineHeight: 'auto', fontWeight: '700' }],
        'bold-m': ['26px', { lineHeight: 'auto', fontWeight: '700' }],
        'bold-r': ['20px', { lineHeight: 'auto', fontWeight: '700' }],

        // SemiBold(600) sizes
        'semibold-xl': ['26px', { lineHeight: 'auto', fontWeight: '600' }],
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