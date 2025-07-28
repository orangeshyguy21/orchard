/* Native Dependencies */
import {MintUnit, MintProofState} from '@server/modules/cashu/cashu.enums';

export type CdklMintProof = {
	created_time: number;
	keyset_id: string;
	unit: MintUnit;
	state: MintProofState;
	amounts: string;
};

export type CdklMintPromise = {
	created_time: number;
	keyset_id: string;
	unit: MintUnit;
	amounts: string;
};

export type CdklMintAnalytics = {
	time_group: string;
	unit: MintUnit;
	amount: number;
	operation_count: number;
	min_created_time: number;
};

export type CdklMintKeysetsAnalytics = {
	time_group: string;
	keyset_id: string;
	amount: number;
	min_created_time: number;
};
