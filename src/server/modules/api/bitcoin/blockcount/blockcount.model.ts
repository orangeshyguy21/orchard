/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
// import { CashuMintBalance } from '@server/modules/cashu/mintdb/cashumintdb.types';

@ObjectType()
export class OrchardBitcoinBlockCount {

	@Field(type => Int)
	height: number;

	constructor(height: number) {
		this.height = height;
	}
}