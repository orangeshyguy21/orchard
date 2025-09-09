/* Core Dependencies */
import {Field, Int, ID, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import {MintUnit, MeltQuoteState, MintPaymentMethod} from '@server/modules/cashu/cashu.enums';
import {CashuMintMeltQuote} from '@server/modules/cashu/mintdb/cashumintdb.types';

// export type CashuMintMeltQuote = {
// 	id: string;
// 	unit: MintUnit;
// 	amount: number;
// 	request: string;
// 	fee_reserve: number;
// 	state: MeltQuoteState;
// 	payment_preimage: string | null;
// 	request_lookup_id: string | null;
// 	msat_to_pay: number | null;
// 	created_time: number;
// 	paid_time: number | null;
// 	payment_method: MintPaymentMethod;
// };

@ObjectType()
export class OrchardMintMeltQuote {
	@Field((type) => ID)
	id: string;

	@Field((type) => MintUnit)
	unit: string;

	@Field((type) => Int)
	amount: number;

	@Field()
	request: string;

	@Field((type) => Int)
	fee_reserve: number;

	@Field((type) => MeltQuoteState)
	state: MeltQuoteState;

	@Field({nullable: true})
	payment_preimage: string;

	@Field({nullable: true})
	request_lookup_id: string;

	@Field((type) => Int, {nullable: true})
	msat_to_pay: number;

	@Field((type) => UnixTimestamp)
	created_time: number;

	@Field((type) => UnixTimestamp, {nullable: true})
	paid_time: number;

	@Field((type) => MintPaymentMethod)
	payment_method: MintPaymentMethod;

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
