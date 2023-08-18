/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const fs = require('fs');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const rnwPath = fs.realpathSync(
    path.resolve(require.resolve('react-native-windows/package.json'), '..'),
);

const projectRoot = path.resolve(__dirname);
// const globalRoot = path.resolve(__dirname, '../');


module.exports = {
  // projectRoot: globalRoot,

  resolver: {
    blockList: exclusionList([
      // This stops "react-native run-windows" from causing the metro server to crash if its already running
      new RegExp(
          `${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`,
      ),
      // This prevents "react-native run-windows" from hitting: EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
      new RegExp(`${rnwPath}/build/.*`),
      new RegExp(`${rnwPath}/target/.*`),
      /.*\.ProjectImports\.zip/,
    ]),
    // nodeModulesPaths: [
    //   path.resolve(projectRoot, 'node_modules'),
    //   // path.resolve(globalRoot, 'node_modules'),
    // ],
    // extraNodeModules: {
    //   projectRoot: path.resolve(globalRoot, 'node_modules'),
    // },
    // alias: {
    //   react: path.resolve(globalRoot, 'node_modules/react'),
    //   '@web': path.resolve(globalRoot, 'src'),
    // }
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
        nonInlinedRequires: ['react']
      },
    }),
    // This fixes the 'missing-asset-registry-path` error (see https://github.com/microsoft/react-native-windows/issues/11437)
    assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
  },
  // watchFolders: [projectRoot],
};