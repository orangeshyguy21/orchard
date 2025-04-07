/* Local Dependencies */
import { Config } from "./configuration.type";

export const config = (): Config => {

	const mode = {
		production: process.env.PRODUCTION === 'true',
	};

	const server = {
		host  : process.env.SERVER_HOST || 'http://localhost',
		port  : process.env.SERVER_PORT || '3321',
		path  : process.env.BASE_PATH || 'api',
		proxy : process.env.TOR_PROXY_SERVER || undefined,
		log   : process.env.LOG_LEVEL || 'info',
	};

	const bitcoin = {
		host : process.env.BITCOIN_RPC_HOST || 'http://localhost',
		port : process.env.BITCOIN_RPC_PORT || '8332',
		user : process.env.BITCOIN_RPC_USER,
		pass : process.env.BITCOIN_RPC_PASSWORD,
	};

	const cashu = {
		backend : process.env.MINT_BACKEND,
		api : process.env.MINT_API,
		database : process.env.MINT_DATABASE,
	};

	const config = {
		mode,
		server,
		bitcoin,
		cashu,
	};

	return config;

}