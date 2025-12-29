/* Core Dependencies */
import {Field, Int, ID, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit, MeltQuoteState} from '@server/modules/cashu/cashu.enums';
import {CashuMintMeltQuote} from '@server/modules/cashu/mintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintMeltQuote {
	@Field(() => ID)
	id: string;

	@Field(() => MintUnit)
	unit: string;

	@Field(() => Int)
	amount: number;

	@Field()
	request: string;

	@Field(() => Int)
	fee_reserve: number;

	@Field(() => MeltQuoteState)
	state: MeltQuoteState;

	@Field({nullable: true})
	payment_preimage: string;

	@Field({nullable: true})
	request_lookup_id: string;

	@Field(() => Int, {nullable: true})
	msat_to_pay: number;

	@Field(() => UnixTimestamp)
	created_time: number;

	@Field(() => UnixTimestamp, {nullable: true})
	paid_time: number;

	@Field(() => String)
	payment_method: string;

	constructor(cashu_mint_melt_quote: CashuMintMeltQuote) {
		this.id = cashu_mint_melt_quote.id;
		this.request = cashu_mint_melt_quote.request;
		this.request_lookup_id = cashu_mint_melt_quote.request_lookup_id;
		this.unit = cashu_mint_melt_quote.unit;
		this.amount = cashu_mint_melt_quote.amount;
		this.fee_reserve = cashu_mint_melt_quote.fee_reserve;
		this.state = cashu_mint_melt_quote.state;
		this.payment_preimage = cashu_mint_melt_quote.payment_preimage;
		this.created_time = cashu_mint_melt_quote.created_time;
		this.paid_time = cashu_mint_melt_quote.paid_time;
		this.msat_to_pay = cashu_mint_melt_quote.msat_to_pay;
		this.payment_method = cashu_mint_melt_quote.payment_method;
	}
}

@ObjectType()
export class OrchardMintNut05Update {
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
}

@ObjectType()
export class OrchardMintNut05QuoteUpdate {
	@Field()
	quote_id: string;

	@Field()
	state: string;
}
