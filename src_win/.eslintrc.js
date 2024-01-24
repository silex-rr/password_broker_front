module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2020, // or 2018 or 2017
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true, // Includes JSX syntax
        },
        requireConfigFile: true,
        babelOptions: {
            configFile: './../babel.config.js',
        },
    },
    plugins: ['prettier', 'react'],
    rules: {
        'prettier/prettier': ['error', {endOfLine: 'auto'}],
        'max-len': ['error', 120],
        'react/jsx-no-styles-inline': 'off',
        'react-native/no-inline-styles': 0,
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/prop-types': 'off',
        // 'indent': ['error', 4],
    },
    extends: ['@react-native', 'plugin:prettier/recommended'],
};
