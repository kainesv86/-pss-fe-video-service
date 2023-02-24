const microFrontedPlugin = require('craco-plugin-micro-frontend');

module.exports = {
  plugins: [
    {
      plugin: microFrontedPlugin,
      options: {
        orgName: 'my-org',
        fileName: 'my-app.js', // should same as package main
        entry: 'src/index.injectable.js', //defaults to src/index.injectable.js,
        orgPackagesAsExternal: false, // defaults to false. marks packages that has @my-org prefix as external so they are not included in the bundle
        reactPackagesAsExternal: true, // defaults to true. marks react and react-dom as external so they are not included in the bundle
        externals: ['react-router', 'react-router-dom'], // defaults to []. marks the specified modules as external so they are not included in the bundle
        minimize: true, // defaults to false, sets optimization.minimize value
        libraryTarget: 'commonjs2', // defaults to umd
        outputPath: 'dist',
        customJestConfig: {}, // custom jest configurations
      },
    },
  ],
};
