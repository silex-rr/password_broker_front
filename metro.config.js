const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const fs = require('fs');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const rnwPath = fs.realpathSync(path.resolve(require.resolve('react-native-windows/package.json'), '..'));

module.exports = mergeConfig(getDefaultConfig(__dirname), {
    resolver: {
        blockList: exclusionList([
            // This stops "react-native run-windows" from causing the metro server to crash if its already running
            new RegExp(`${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`),
            // eslint-disable-next-line max-len
            // This prevents "react-native run-windows" from hitting:  EBUSY: resource busy or locked, open msbuild.ProjectImports.zip or other files produced by msbuild
            new RegExp(`${rnwPath}/build/.*`),
            new RegExp(`${rnwPath}/target/.*`),
            /.*\.ProjectImports\.zip/,
        ]),
    },
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
        // eslint-disable-next-line max-len
        // This fixes the 'missing-asset-registry-path` error (see https://github.com/microsoft/react-native-windows/issues/11437)
        assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
    },
});
