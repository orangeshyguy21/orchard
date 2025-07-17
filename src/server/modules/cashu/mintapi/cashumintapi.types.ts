import {MintUnit} from '@server/modules/cashu/cashu.enums';

export type CashuMintInfo = {
	name: string;
	pubkey: string;
	version: string;
	description: string;
	description_long: string;
	contact: CashuContact[];
	motd: string;
	icon_url: string;
	urls: string[];
	time: number;
	nuts: {
		4: {
			methods: Record<string, CashuNut4Method>;
			disabled: boolean;
		};
		5: {
			methods: Record<string, CashuNut5Method>;
			disabled: boolean;
		};
		7: {
			supported: boolean;
		};
		8: {
			supported: boolean;
		};
		9: {
			supported: boolean;
		};
		10: {
			supported: boolean;
		};
		11: {
			supported: boolean;
		};
		12: {
			supported: boolean;
		};
		14: {
			supported: boolean;
		};
		15: {
			methods: Record<string, CashuNut15Method>;
		};
		17: {
			supported: Record<string, CashuNutSupported>;
		};
		19: {
			cached_endpoints: Record<string, CashuCachedEndpoint>;
			ttl: number;
		};
		20: {
			supported: boolean;
		};
	};
};

export type CashuContact = {
	method: string;
	info: string;
};

export type CashuNut4Method = {
	method: string;
	unit: MintUnit;
	description: boolean;
	min_amount?: number;
	max_amount?: number;
};

export type CashuNut5Method = {
	method: string;
	unit: MintUnit;
	amountless?: boolean;
	min_amount?: number;
	max_amount?: number;
};

export type CashuNut15Method = {
	method: string;
	unit: MintUnit;
};

export type CashuNutSupported = {
	method: string;
	unit: MintUnit;
	commands?: string[];
};

export type CashuCachedEndpoint = {
	method: string;
	path: string;
};
