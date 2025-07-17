import path from 'path';

const {EnvironmentPlugin} = require('webpack');

require('dotenv').config({
	path: '.env',
});

module.exports = {
	output: {
		crossOriginLoading: 'anonymous',
	},
	resolve: {
		alias: {
			'@styles': path.resolve(__dirname, './styles'),
			'@assets': path.resolve(__dirname, './assets'),
		},
	},
	plugins: [
		new EnvironmentPlugin({
			PRODUCTION: true,
			BASE_PATH: 'api',
			BITCOIN_TYPE: null,
			LIGHTNING_TYPE: null,
			TAPROOT_ASSETS_TYPE: null,
			MINT_TYPE: null,
			AI_API: null,
			npm_package_version: '0.0.1',
		}),
	],
};
