/* Application Dependencies */
import {TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
import {OrchardAnalyticsInterval} from '@server/modules/orchard/orchard.enums';
/* Native Dependencies */
import {MintUnit, MintQuoteState, MeltQuoteState, MintProofState} from '@server/modules/cashu/cashu.enums';

export interface CashuMintMintQuotesArgs {
	date_start?: number;
	date_end?: number;
	units?: MintUnit[];
	states?: MintQuoteState[];
	page?: number;
	page_size?: number;
}

export interface CashuMintMeltQuotesArgs {
	date_start?: number;
	date_end?: number;
	units?: MintUnit[];
	states?: MeltQuoteState[];
	page?: number;
	page_size?: number;
}

export interface CashuMintPromiseArgs {
	date_start?: number;
	date_end?: number;
	units?: MintUnit[];
	id_keysets?: string[];
	page?: number;
	page_size?: number;
}

export interface CashuMintProofsArgs {
	date_start?: number;
	date_end?: number;
	units?: MintUnit[];
	states?: MintProofState[];
	id_keysets?: string[];
	page?: number;
	page_size?: number;
}

export interface CashuMintAnalyticsArgs {
	date_start?: number;
	date_end?: number;
	units?: MintUnit[];
	interval?: OrchardAnalyticsInterval;
	timezone?: TimezoneType;
}

export interface CashuMintKeysetProofsArgs {
	date_start?: number;
	date_end?: number;
	id_keysets?: string[];
}
