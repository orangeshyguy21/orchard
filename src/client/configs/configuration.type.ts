export type Config = {
	mode : {
		production: boolean;
		version: string;
	},
	api : {
		proxy: string;
		path: string;
	},
	bitcoin : {
		enabled: boolean;
	},
	lightning : {
		enabled: boolean;
	},
	mint : {
		enabled: boolean;
		critical_path: string;
	},
	ai : {
		enabled: boolean;
	}
};