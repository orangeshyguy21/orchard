/* Local Dependencies */
import {Config} from './configuration.type';

export const config = (): Config => {
	const mode = {
		production: process.env.NODE_ENV === 'production',
	};

	const server = {
		host: process.env.SERVER_HOST || 'http://localhost',
		port: process.env.SERVER_PORT || '3321',
		path: process.env.BASE_PATH || 'api',
		proxy: process.env.TOR_PROXY_SERVER || undefined,
		log: process.env.LOG_LEVEL || 'info',
		pass: process.env.ADMIN_PASSWORD,
		ttl: process.env.THROTTLE_TTL || '60000',
		limit: process.env.THROTTLE_LIMIT || '20',
	};

	const bitcoin = {
		type: process.env.BITCOIN_TYPE,
		host: process.env.BITCOIN_RPC_HOST,
		port: process.env.BITCOIN_RPC_PORT,
		user: process.env.BITCOIN_RPC_USER,
		pass: process.env.BITCOIN_RPC_PASSWORD,
	};

	const lightning = {
		type: process.env.LIGHTNING_TYPE,
		host: process.env.LIGHTNING_RPC_HOST,
		port: process.env.LIGHTNING_RPC_PORT,
		macaroon: process.env.LIGHTNING_MACAROON,
		cert: process.env.LIGHTNING_CERT,
	};

	const taproot_assets = {
		type: process.env.TAPROOT_ASSETS_TYPE,
		host: process.env.TAPROOT_ASSETS_RPC_HOST,
		port: process.env.TAPROOT_ASSETS_RPC_PORT,
		macaroon: process.env.TAPROOT_ASSETS_MACAROON,
		cert: process.env.TAPROOT_ASSETS_CERT,
	};

	const cashu = {
		type: process.env.MINT_TYPE,
		api: process.env.MINT_API,
		database_type: process.env.MINT_DATABASE.includes('postgres://') ? 'postgres' : 'sqlite',
		database: process.env.MINT_DATABASE,
		rpc_host: process.env.MINT_RPC_HOST,
		rpc_port: process.env.MINT_RPC_PORT,
		rpc_key: process.env.MINT_RPC_KEY,
		rpc_cert: process.env.MINT_RPC_CERT,
		rpc_ca: process.env.MINT_RPC_CA,
	};

	const ai = {
		api: process.env.AI_API,
	};

	const config = {
		mode,
		server,
		bitcoin,
		lightning,
		taproot_assets,
		cashu,
		ai,
	};

	return config;
};
