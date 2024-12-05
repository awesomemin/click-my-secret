import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#181A20',
        primary: '#379392',
        gray: '#777777',
        lightGray: '#35383f',
        inputBg: '#1f222a',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
} satisfies Config;
