const path = require('path');
const {override, useBabelRc} = require('customize-cra');

module.exports = {
    webpack: override(useBabelRc()),
    paths: function (paths, env) {
        paths.appIndexJs = path.resolve(__dirname, 'index.web.js');
        paths.appSrc = path.resolve(__dirname, '');
        return paths;
    },
};
