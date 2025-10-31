import type { Config } from 'tailwindcss'

const config: Config = { 

  // This part tells Tailwind where to look for your classes
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // You can add custom colors, fonts, etc. here later
    },
  },
  plugins: [],
}

export default config