/* Shared Dependencies */

export type Nut15Method = {
	unit: string;
	methods: string[];
};

export type Nut17Commands = {
	unit: string;
	methods: {
		method: string;
		commands: string[];
	}[];
};
