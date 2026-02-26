/* Core Dependencies */
import {Field, Int, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {UnixTimestamp} from '@server/modules/graphql/scalars/unixtimestamp.scalar';

@ObjectType()
export class OrchardMintPulseActivity {
	@Field(() => Int)
	mint_count: number;

	@Field(() => Int)
	melt_count: number;

	@Field(() => Int)
	swap_count: number;

	constructor(mint_count: number, melt_count: number, swap_count: number) {
		this.mint_count = mint_count;
		this.melt_count = melt_count;
		this.swap_count = swap_count;
	}
}

@ObjectType()
export class OrchardMintPulseQuoteRate {
	@Field(() => Int)
	total: number;

	@Field(() => Int)
	completed: number;

	constructor(total: number, completed: number) {
		this.total = total;
		this.completed = completed;
	}
}

@ObjectType()
export class OrchardMintPulse {
	@Field(() => OrchardMintPulseActivity)
	current_24h: OrchardMintPulseActivity;

	@Field(() => OrchardMintPulseActivity)
	previous_24h: OrchardMintPulseActivity;

	@Field(() => OrchardMintPulseQuoteRate)
	mint_quote_rate: OrchardMintPulseQuoteRate;

	@Field(() => OrchardMintPulseQuoteRate)
	melt_quote_rate: OrchardMintPulseQuoteRate;

	@Field(() => UnixTimestamp, {nullable: true})
	last_mint_time: number | null;

	@Field(() => UnixTimestamp, {nullable: true})
	last_melt_time: number | null;

	@Field(() => UnixTimestamp, {nullable: true})
	last_swap_time: number | null;

	@Field(() => Int, {nullable: true})
	avg_mint_time: number | null;

	@Field(() => Int, {nullable: true})
	avg_melt_time: number | null;

	constructor(
		current_24h: OrchardMintPulseActivity,
		previous_24h: OrchardMintPulseActivity,
		mint_quote_rate: OrchardMintPulseQuoteRate,
		melt_quote_rate: OrchardMintPulseQuoteRate,
		last_mint_time: number | null,
		last_melt_time: number | null,
		last_swap_time: number | null,
		avg_mint_time: number | null,
		avg_melt_time: number | null,
	) {
		this.current_24h = current_24h;
		this.previous_24h = previous_24h;
		this.mint_quote_rate = mint_quote_rate;
		this.melt_quote_rate = melt_quote_rate;
		this.last_mint_time = last_mint_time;
		this.last_melt_time = last_melt_time;
		this.last_swap_time = last_swap_time;
		this.avg_mint_time = avg_mint_time;
		this.avg_melt_time = avg_melt_time;
	}
}
