/* Core Dependencies */
import { Field, Int, ID, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '@server/modules/graphql/scalars/unixtimestamp.scalar';
import { CashuMintPromise } from '@server/modules/cashu/mintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintPromise {

	@Field(type => Int)
	amount: number;

	@Field({ nullable: true })
	id: string;

	@Field(type => ID)
	b_: string;

	@Field()
	c_: string;

	@Field({ nullable: true })
	dleq_e: string;

	@Field({ nullable: true })
	dleq_s: string;

	@Field(type => UnixTimestamp, { nullable: true })
	created: number;

	@Field({ nullable: true })
	mint_quote: string;

	@Field({ nullable: true })
	swap_id: string;

	constructor(cashu_mint_promise: CashuMintPromise) {
		this.amount = cashu_mint_promise.amount;
		this.id = cashu_mint_promise.id;
		this.b_ = cashu_mint_promise.b_;
		this.c_ = cashu_mint_promise.c_;
		this.dleq_e = cashu_mint_promise.dleq_e;
		this.dleq_s = cashu_mint_promise.dleq_s;
		this.created = cashu_mint_promise.created;
		this.mint_quote = cashu_mint_promise.mint_quote;
		this.swap_id = cashu_mint_promise.swap_id;
	}
}