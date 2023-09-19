module.exports = {
    root: true,
    extends: ['@react-native', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['error', {endOfLine: 'auto'}],
        'max-len': ['error', 120],
        'react/jsx-no-styles-inline': 'off',
        'react-native/no-inline-styles': 0,
        // 'indent': ['error', 4],
    },
};
