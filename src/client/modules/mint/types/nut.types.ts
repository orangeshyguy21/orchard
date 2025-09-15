/* Shared Dependencies */
import {MintPaymentMethod} from '@shared/generated.types';

export type Nut15Method = {
	unit: string;
	methods: MintPaymentMethod[];
};

export type Nut17Commands = {
	unit: string;
	methods: {
		method: MintPaymentMethod;
		commands: string[];
	}[];
};
