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
      borderWidth: {
        'custom-s': '0.0875rem'
      },
      borderRadius: {
        'custom-s': '0.25rem',
        'custom-m': '0.5rem',
        'custom-l': '0.875rem'
      },
      boxShadow: {
        '8': '0 0 0.2rem 0.125rem rgba(182, 182, 182, 0.08)'
      },
      fontSize: {
        // Bold(700) sizes
        'bold-l': ['1.625rem', { lineHeight: 'auto', fontWeight: '700' }],
        'bold-m': ['1.5rem', { lineHeight: 'auto', fontWeight: '700' }],
        'bold-r': ['1.25rem', { lineHeight: 'auto', fontWeight: '700' }],
        'bold-s': ['1.125rem', { lineHeight: 'auto', fontWeight: '700' }],

        // SemiBold(600) sizes
        'semibold-l': ['1.375rem', { lineHeight: 'auto', fontWeight: '600' }],
        'semibold-m': ['1.25rem', { lineHeight: 'auto', fontWeight: '600' }],
        'semibold-r': ['1.125rem', { lineHeight: 'auto', fontWeight: '600' }],
        'semibold-s': ['1rem', { lineHeight: 'auto', fontWeight: '600' }],

        // Medium(500) sizes
        'medium-xl': ['1.375rem', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-l': ['1.25rem', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-m': ['1.125rem', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-r': ['1rem', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-s': ['0.875rem', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-xs': ['0.75rem', { lineHeight: 'auto', fontWeight: '500' }],
        'medium-xxs': ['0.625rem', { lineHeight: 'auto', fontWeight: '500' }],
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
      spacing: {
        0.375:'0.375rem',
        27.5: '27.5rem',
        42.5: '42.5rem',
        47.5: '47.5rem'
      }
    },
  },
  plugins: [],
}