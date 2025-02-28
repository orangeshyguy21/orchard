import { MintUnit } from '@server/modules/graphql/enums/mintunit.enum';
import { MintQuoteStatus } from '@server/modules/graphql/enums/mintquotestatus.enum';

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