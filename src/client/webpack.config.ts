import path from 'path';

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
};
