module.exports = {
    root: true,
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['error', {endOfLine: 'auto'}],
        'max-len': ['error', 120],
        'react/jsx-no-styles-inline': 'off',
        'react-native/no-inline-styles': 0,
        // 'indent': ['error', 4],
    },
    extends: ['@react-native', 'plugin:prettier/recommended'],
};
