/* Core Dependencies */
import {Field, Int, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {BitcoinFeeEstimate} from '@server/modules/bitcoin/rpc/btcrpc.types';

@ObjectType()
export class OrchardBitcoinTxFeeEstimate {
	@Field(() => Int)
	target: number;

	@Field(() => Float, {nullable: true})
	feerate: number;

	@Field(() => [String], {nullable: true})
	errors: string[];

	@Field(() => Int)
	blocks: number;

	constructor(target: number, obte: BitcoinFeeEstimate) {
		this.target = target;
		this.feerate = obte.feerate;
		this.errors = obte.errors;
		this.blocks = obte.blocks;
	}
}
