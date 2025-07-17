/* Core Dependencies */
import {Field, Int, ID, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit, MintQuoteState} from '@server/modules/cashu/cashu.enums';
import {CashuMintMintQuote} from '@server/modules/cashu/mintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintMintQuote {
	@Field((type) => ID)
	id: string;

	@Field((type) => Int)
	amount: number;

	@Field((type) => MintUnit)
	unit: string;

	@Field()
	request: string;

	@Field((type) => MintQuoteState)
	state: MintQuoteState;

	@Field({nullable: true})
	request_lookup_id: string;

	@Field({nullable: true})
	pubkey: string;

	@Field((type) => UnixTimestamp)
	created_time: number;

	@Field((type) => UnixTimestamp, {nullable: true})
	issued_time: number;

	@Field((type) => UnixTimestamp, {nullable: true})
	paid_time: number;

	constructor(cashu_mint_mint_quote: CashuMintMintQuote) {
		this.id = cashu_mint_mint_quote.id;
		this.amount = cashu_mint_mint_quote.amount;
		this.unit = cashu_mint_mint_quote.unit;
		this.request = cashu_mint_mint_quote.request;
		this.state = cashu_mint_mint_quote.state;
		this.request_lookup_id = cashu_mint_mint_quote.request_lookup_id;
		this.pubkey = cashu_mint_mint_quote.pubkey;
		this.issued_time = cashu_mint_mint_quote.issued_time;
		this.created_time = cashu_mint_mint_quote.created_time;
		this.paid_time = cashu_mint_mint_quote.paid_time;
	}
}

@ObjectType()
export class OrchardMintNut04Update {
	@Field()
	unit: string;

	@Field()
	method: string;

	@Field({nullable: true})
	disabled: boolean;

	@Field(() => Int, {nullable: true})
	min_amount: number;

	@Field(() => Int, {nullable: true})
	max_amount: number;

	@Field({nullable: true})
	description: boolean;
}

@ObjectType()
export class OrchardMintNut04QuoteUpdate {
	@Field()
	quote_id: string;

	@Field()
	state: string;
}
