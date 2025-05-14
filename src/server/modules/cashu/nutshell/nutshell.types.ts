/* Native Dependencies */
import { MintUnit, MintQuoteState } from "@server/modules/cashu/cashu.enums";

export type NutshellMintMintQuote = {
	quote: string;
    request: string;
    checking_id: string;
	unit: MintUnit;
    amount: number;
    created_time: number;
	paid_time: number;
	state: MintQuoteState;
	pubkey: string;
}