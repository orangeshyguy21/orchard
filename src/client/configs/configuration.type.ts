export type Config = {
	mode : {
		production: boolean;
		version: string;
	},
	api : {
		proxy: string;
		path: string;
	},
	ai : {
		api: string | undefined;
	}
};