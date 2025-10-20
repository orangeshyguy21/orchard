/* Local Dependencies */
import {Config} from './configuration.type';

const replaceLocalhostInDocker = (host: string | undefined): string | undefined => {
	if (!host) return host;
	if (!process.env.DOCKER_ENV) return host;
	return host
		.replace(/\/\/localhost(?=[:/]|$)/gi, '//host.docker.internal')
		.replace(/\/\/127\.0\.0\.1(?=[:/]|$)/g, '//host.docker.internal')
		.replace(/\blocalhost\b/gi, 'host.docker.internal')
		.replace(/\b127\.0\.0\.1\b/g, 'host.docker.internal')
		.replace(/\[::1\]/g, 'host.docker.internal')
		.replace(/::1(?=[:/]|$)/g, 'host.docker.internal');
};

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
		key: process.env.SETUP_KEY || process.env.ADMIN_PASSWORD,
		ttl: process.env.THROTTLE_TTL || '60000',
		limit: process.env.THROTTLE_LIMIT || '20',
	};

	const database = {
		path: process.env.DATABASE_PATH || 'data/orchard.db',
		synchronize: process.env.NODE_ENV !== 'production',
	};

	const bitcoin = {
		type: process.env.BITCOIN_TYPE,
		host: replaceLocalhostInDocker(process.env.BITCOIN_RPC_HOST),
		port: process.env.BITCOIN_RPC_PORT,
		user: process.env.BITCOIN_RPC_USER,
		pass: process.env.BITCOIN_RPC_PASSWORD,
	};

	const lightning = {
		type: process.env.LIGHTNING_TYPE,
		host: replaceLocalhostInDocker(process.env.LIGHTNING_RPC_HOST),
		port: process.env.LIGHTNING_RPC_PORT,
		macaroon: process.env.LIGHTNING_MACAROON,
		cert: process.env.LIGHTNING_CERT,
		key: process.env.LIGHTNING_KEY,
		ca: process.env.LIGHTNING_CA,
	};

	const taproot_assets = {
		type: process.env.TAPROOT_ASSETS_TYPE,
		host: replaceLocalhostInDocker(process.env.TAPROOT_ASSETS_RPC_HOST),
		port: process.env.TAPROOT_ASSETS_RPC_PORT,
		macaroon: process.env.TAPROOT_ASSETS_MACAROON,
		cert: process.env.TAPROOT_ASSETS_CERT,
	};

	const cashu = {
		type: process.env.MINT_TYPE,
		api: replaceLocalhostInDocker(process.env.MINT_API),
		database_type: process.env.MINT_DATABASE?.match(/postgres(ql)?:\/\//) ? 'postgres' : 'sqlite',
		database: replaceLocalhostInDocker(process.env.MINT_DATABASE),
		database_ca: process.env.MINT_DATABASE_CA,
		database_cert: process.env.MINT_DATABASE_CERT,
		database_key: process.env.MINT_DATABASE_KEY,
		rpc_host: replaceLocalhostInDocker(process.env.MINT_RPC_HOST),
		rpc_port: process.env.MINT_RPC_PORT,
		rpc_key: process.env.MINT_RPC_KEY,
		rpc_cert: process.env.MINT_RPC_CERT,
		rpc_ca: process.env.MINT_RPC_CA,
	};

	const ai = {
		api: replaceLocalhostInDocker(process.env.AI_API),
	};

	const config = {
		mode,
		server,
		database,
		bitcoin,
		lightning,
		taproot_assets,
		cashu,
		ai,
	};

	return config;
};
