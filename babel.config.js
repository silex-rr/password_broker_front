const path = require("path");
const projectRoot = path.resolve(__dirname);
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver',
      {
        alias: {
          // react: path.resolve(globalRoot, 'node_modules/react'),
          // 'react-dom': path.resolve(globalRoot, 'node_modules/react-dom'),
          // // '@web': path.resolve(globalRoot, 'src'),
        },
      },
    ],
  ],
};
