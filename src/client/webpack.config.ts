import path from "path";

const { EnvironmentPlugin } = require('webpack');

require('dotenv').config({
  path: '.env'
});

module.exports = {
  output: {
    crossOriginLoading: 'anonymous'
  },
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, './styles'),
      '@assets': path.resolve(__dirname, './assets'),
    }
  },
  plugins: [
    new EnvironmentPlugin([
      'PRODUCTION',
      'BASE_PATH',
      'npm_package_version'
    ])
  ]
}