/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {LightningRequest} from '@server/modules/lightning/lightning/lightning.types';
import {LightningRequestType} from '@server/modules/lightning/lightning.enums';

@ObjectType()
export class OrchardLightningRequest {
	@Field(() => LightningRequestType)
	type: LightningRequestType;

	@Field(() => Boolean)
	valid: boolean;

	@Field(() => Number, {nullable: true})
	expiry: number;

	@Field(() => String, {nullable: true})
	description: string;

	@Field(() => Number, {nullable: true})
	offer_quantity_max: number;

	constructor(lnrequest: LightningRequest) {
		this.type = lnrequest.type;
		this.valid = lnrequest.valid;
		this.expiry = lnrequest.expiry;
		this.description = lnrequest.description;
		this.offer_quantity_max = lnrequest.offer_quantity_max;
	}
}
