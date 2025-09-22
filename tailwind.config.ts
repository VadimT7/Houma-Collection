import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        houma: {
          black: '#0A0A0A',
          'deep-black': '#000000',
          white: '#FAFAF8',
          'off-white': '#F5F5F0',
          gold: '#D4AF37',
          'gold-light': '#E8D284',
          'gold-dark': '#B8941F',
          sand: '#D2B48C',
          'desert-rose': '#C08970',
          'desert-dusk': '#8B6F47',
          'desert-night': '#4A3C28',
          smoke: '#2C2C2C',
          'smoke-light': '#3D3D3D',
        }
      },
      fontFamily: {
        'luxury': ['Helvetica Neue', 'Arial', 'sans-serif'],
        'display': ['Bebas Neue', 'Impact', 'sans-serif'],
        'cultural': ['Amiri', 'Georgia', 'serif'],
        'arabic': ['Cairo', 'Noto Kufi Arabic', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-down': 'fadeDown 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'parallax': 'parallax 20s linear infinite',
        'marquee': 'marquee 25s linear infinite',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0.0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        parallax: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, #0A0A0A 0%, #2C2C2C 50%, #0A0A0A 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #E8D284 50%, #D4AF37 100%)',
        'gradient-desert': 'linear-gradient(135deg, #D2B48C 0%, #C08970 50%, #8B6F47 100%)',
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(212, 175, 55, 0.15)',
        'luxury-lg': '0 20px 60px rgba(212, 175, 55, 0.25)',
        'deep': '0 20px 40px rgba(0, 0, 0, 0.8)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    // Removed plugins that might cause issues - can be added back later if needed
  ],
}

export default config
