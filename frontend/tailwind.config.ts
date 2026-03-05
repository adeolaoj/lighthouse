import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral colors
        white: '#FFFFFF',
        black: '#000000',
        // Primary purple palette
        purple: {
          primary: '#C084FC', // Main purple
          light: '#E9D5FF',   // Light purple for text/accents
          50: '#F9F1FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          600: '#C084FC',
          700: '#A855F7',
        },
        // Dark background palette
        bg: {
          dark: {
            1: '#0A0714',
            2: '#110A24',
            3: '#160C2E',
            4: '#0E0919',
          },
        },
        // Slate/neutral palette
        slate: {
          100: '#E2E8F0',
          400: '#94A3A8',
        },
      },
      fontFamily: {
        poppins: ["'Poppins'", 'sans-serif'],
      },
      backdropBlur: {
        lg: '32px',
      },
    },
  },
  plugins: [],
}

export default config
