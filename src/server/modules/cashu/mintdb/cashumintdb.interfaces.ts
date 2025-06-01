/* Application Dependencies */
import { TimezoneType } from '@server/modules/graphql/scalars/timezone.scalar';
/* Native Dependencies */
import { MintUnit, MintQuoteState, MeltQuoteState } from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import { MintAnalyticsInterval } from './cashumintdb.enums';

export interface CashuMintPromisesArgs {
    id_keysets?: string[];
    date_start?: number;
    date_end?: number;
}

export interface CashuMintMintQuotesArgs {
    unit?: MintUnit[];
    date_start?: number;
    date_end?: number;
    state?: MintQuoteState[];
    timezone?: TimezoneType;
    page?: number;
    page_size?: number;
}

export interface CashuMintMeltQuotesArgs {
    unit?: MintUnit[];
    date_start?: number;
    date_end?: number;
    state?: MeltQuoteState[];
    timezone?: TimezoneType;
    page?: number;
    page_size?: number;
}


export interface CashuMintAnalyticsArgs {
    units?: MintUnit[];
    date_start?: number;
    date_end?: number;
    interval?: MintAnalyticsInterval;
    timezone?: TimezoneType;
}