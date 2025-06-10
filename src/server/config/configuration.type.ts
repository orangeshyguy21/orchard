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
		type : string;
		host : string;
		port : string;
		user : string;
		pass : string;
	},
	lightning: {
		type: string;
		host: string;
		port: string;
		macaroon: string;
		cert: string;
	},
	cashu : {
		type : string;
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
