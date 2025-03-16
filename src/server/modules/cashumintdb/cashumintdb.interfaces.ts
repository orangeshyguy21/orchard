/* Local Dependencies */
import { MintUnit, MintQuoteStatus, MintAnalyticsInterval } from './cashumintdb.enums';
import { TimezoneType } from '@server/modules/graphql/scalars/timezone.scalar';

export interface CashuMintPromisesArgs {
    id_keysets?: string[];
    date_start?: number;
    date_end?: number;
}

export interface CashuMintMintQuotesArgs {
    unit?: MintUnit[];
    date_start?: number;
    date_end?: number;
    status?: MintQuoteStatus[];
}

export interface CashuMintAnalyticsArgs {
    units?: MintUnit[];
    date_start?: number;
    date_end?: number;
    interval?: MintAnalyticsInterval;
    timezone?: TimezoneType;
}