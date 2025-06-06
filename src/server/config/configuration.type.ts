export type Config = {
	mode : {
		production: boolean;
	},
	server : {
		host: string;
		port: string;
		path: string;
		proxy: string | undefined;
		log: string;
	},
	bitcoin : {
		host : string;
		port : string;
		user : string;
		pass : string;
	},
	cashu : {
		backend : string;
		api: string;
		database : string;
		rpc_host : string;
		rpc_port : string;
		rpc_key : string;
		rpc_cert : string;
		rpc_ca : string;
	},
	ai : {
		api : string;
	}
};