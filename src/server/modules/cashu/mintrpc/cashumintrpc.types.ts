import { CashuMintInfo } from "@server/modules/cashu/mintapi/cashumintapi.types";

export type CashuMintInfoRpc = Omit<CashuMintInfo, 'pubkey' | 'time' | 'nuts' | 'description_long'> & {
	total_issued: string;
	total_redeemed: string;
	long_description: string;
}