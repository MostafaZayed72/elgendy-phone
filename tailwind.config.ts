import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '420px'
      },
      fontFamily: {
        sans: ['Tajawal', 'Inter', 'sans-serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#1e6bb8',
          600: '#195a9c',
          700: '#144980',
          800: '#0f3964',
          900: '#0a2848'
        }
      }
    }
  }
}
