/* Shared Dependencies */
import {OrchardMintMintQuote, MintQuoteState, MintUnit} from '@shared/generated.types';

export class MintMintQuote implements OrchardMintMintQuote {
	public id: string;
	public amount: number;
	public unit: MintUnit;
	public request: string;
	public state: MintQuoteState;
	public request_lookup_id: string | null;
	public pubkey: string | null;
	public issued_time: number | null;
	public created_time: number | null;
	public paid_time: number | null;

	constructor(mint_mint_quote: OrchardMintMintQuote) {
		this.id = mint_mint_quote.id;
		this.amount = mint_mint_quote.amount;
		this.unit = mint_mint_quote.unit;
		this.request = mint_mint_quote.request;
		this.state = mint_mint_quote.state;
		this.request_lookup_id = mint_mint_quote.request_lookup_id ?? null;
		this.pubkey = mint_mint_quote.pubkey ?? null;
		this.issued_time = mint_mint_quote.issued_time ?? null;
		this.created_time = mint_mint_quote.created_time ?? null;
		this.paid_time = mint_mint_quote.paid_time ?? null;
	}
}
