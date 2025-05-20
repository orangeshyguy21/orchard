export type Config = {
	mode : {
		production: boolean;
		version: string;
	},
	api : {
		proxy: string;
		path: string;
	},
	cashu : {
		critical_path: string;
	},
	ai : {
		api: string | null;
	}
};