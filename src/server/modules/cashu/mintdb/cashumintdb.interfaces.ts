/* Application Dependencies */
import { TimezoneType } from '@server/modules/graphql/scalars/timezone.scalar';
/* Native Dependencies */
import { MintUnit, MintQuoteStatus } from '@server/modules/cashu/cashu.enums';
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
    status?: MintQuoteStatus[];
}

export interface CashuMintAnalyticsArgs {
    units?: MintUnit[];
    date_start?: number;
    date_end?: number;
    interval?: MintAnalyticsInterval;
    timezone?: TimezoneType;
}