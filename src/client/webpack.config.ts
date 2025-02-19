import path from "path";

const { EnvironmentPlugin } = require('webpack');

require('dotenv').config({
  path: '.env.local'
});

module.exports = {
  output: {
    crossOriginLoading: 'anonymous'
  },
  resolve: {
    alias: {
      '@style': path.resolve(__dirname, './style'),
    }
  },
  plugins: [
    new EnvironmentPlugin([
      'PRODUCTION',
      'BASE_PATH'
    ])
  ]
}