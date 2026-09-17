/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.{html,js}'],
  theme: {
    screens: {
      mob: { max: '450px' },
      desk: { min: '451px' },
    },
    colors: {
      gold: '#E0CC7F',
      white: '#ffffff',
      black: '#000000',
      text_black: '#1E1C1A',
      creamy_white: '#FAF6F0',
      gray: '#9A9A9A',
      dark_red: '#980109',
      gold_600: '#D3BD66',
      gold_700: '#BAA75A',
      gold_300: '#F5E5A3',
      gray_200: '#EFEFEF',
    },
    extend: {},
  },
  plugins: [],
};
