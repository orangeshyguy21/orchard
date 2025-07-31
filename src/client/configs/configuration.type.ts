export type Config = {
	mode: {
		production: boolean;
		version: string;
	};
	api: {
		proxy: string;
		path: string;
	};
	bitcoin: {
		enabled: boolean;
	};
	lightning: {
		enabled: boolean;
	};
	taproot_assets: {
		enabled: boolean;
	};
	mint: {
		enabled: boolean;
		critical_path: string;
		database_type: string;
	};
	ai: {
		enabled: boolean;
	};
	constants: {
		taproot_asset_ids: {
			usdt: string;
		};
	};
};
