/* Core Dependencies */
import {Field, ObjectType, Float} from '@nestjs/graphql';
/* Application Dependencies */
import {MintUnit} from '@server/modules/cashu/cashu.enums';

@ObjectType()
export class OrchardLightningAnalytics {
	@Field((type) => Float)
	amount: number;

	@Field((type) => String)
	unit: MintUnit;

	@Field((type) => Float)
	created_time: number;

	constructor(amount_sat: number, created_time: number) {
		this.amount = amount_sat;
		this.unit = MintUnit.sat;
		this.created_time = created_time;
	}
}
