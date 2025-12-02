/* Core Dependencies */
import fs from 'node:fs/promises';
import {config} from 'dotenv';
config({ path: '.env', override: false, quiet: true });

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
	database_type: process.env['MINT_DATABASE']?.match(/postgres(ql)?:\/\//) ? 'postgres' : 'sqlite',
};

const ai = {
	enabled: process.env['AI_API'] ? true : false,
};

const constants = {
	taproot_asset_ids: {
		usdt: '594ad28f56e02a3cbeef62166c92317fea911730392ea715ff756a398a8ffc4e',
	},
};

const runtime_config = {
	mode,
	api,
	bitcoin,
	lightning,
	taproot_assets,
	mint,
	ai,
	constants,
};

if (process.env.NODE_ENV === 'production') {
	const output_path = `${process.cwd()}/dist/client/browser/config.json`;
	await fs.writeFile(output_path, JSON.stringify(runtime_config, null, 2));
} else {
	const output_path = `${process.cwd()}/public/config.json`;
	await fs.writeFile(output_path, JSON.stringify(runtime_config, null, 2));
}