/* Native Dependencies */
import {MintUnit, MintProofState} from '@server/modules/cashu/cashu.enums';

export type CdkMintProof = {
	created_time: number;
	keyset_id: string;
	unit: MintUnit;
	state: MintProofState;
	amounts: string;
};

export type CdkMintPromise = {
	created_time: number;
	keyset_id: string;
	unit: MintUnit;
	amounts: string;
};

export type CdkMintAnalytics = {
	time_group: string;
	unit: MintUnit;
	amount: number;
	operation_count: number;
	min_created_time: number;
};

export type CdkMintKeysetsAnalytics = {
	time_group: string;
	keyset_id: string;
	amount: number;
	min_created_time: number;
};
