import {Config} from './configuration.type';

const mode = {
	production: process.env['NODE_ENV'] === 'production',
	version: `orchard/${process.env['npm_package_version'] || '1.0.0'}`,
};

const api = {
	proxy: mode.production ? '' : '/proxy',
	path: process.env['BASE_PATH'] || 'api',
};

const bitcoin = {
	enabled: process.env['BITCOIN_TYPE'] ? true : false,
};

const lightning = {
	enabled: process.env['LIGHTNING_TYPE'] ? true : false,
};

const taproot_assets = {
	enabled: process.env['TAPROOT_ASSETS_TYPE'] ? true : false,
};

const mint = {
	enabled: process.env['MINT_TYPE'] ? true : false,
	type: process.env['MINT_TYPE'] || 'cdk',
	critical_path: '/v1/info',
	database_type: process.env['MINT_DATABASE']?.includes('postgres://') ? 'postgres' : 'sqlite',
};

const ai = {
	enabled: process.env['AI_API'] ? true : false,
};

const constants = {
	taproot_asset_ids: {
		usdt: '594ad28f56e02a3cbeef62166c92317fea911730392ea715ff756a398a8ffc4e',
	},
};

export const environment: Config = {
	mode,
	api,
	bitcoin,
	lightning,
	taproot_assets,
	mint,
	ai,
	constants,
};
