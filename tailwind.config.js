module.exports = {
  content: [
    "./src_web/**/*.{js,jsx,ts,tsx}",
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}