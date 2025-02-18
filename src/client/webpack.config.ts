const { EnvironmentPlugin } = require('webpack');

require('dotenv').config({
  path: '.env.local'
});

module.exports = {
  output: {
    crossOriginLoading: 'anonymous'
  },
  plugins: [
    new EnvironmentPlugin([
      'PRODUCTION',
      'BASE_PATH'
    ])
  ]
}