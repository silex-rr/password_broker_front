module.exports = {
    content: {
        files: [
            './src_web/**/*.{js,jsx,ts,tsx}',
            'node_modules/daisyui/dist/**/*.js',
            'node_modules/react-daisyui/dist/**/*.js',
        ],
    },
    safelist: ['text-yellow-500', 'text-emerald-300'],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['light', 'dark'],
    },
};
