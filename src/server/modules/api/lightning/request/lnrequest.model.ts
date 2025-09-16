/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {LightningRequest} from '@server/modules/lightning/lightning/lightning.types';
import {LightningRequestType} from '@server/modules/lightning/lightning.enums';

@ObjectType()
export class OrchardLightningRequest {
	@Field((type) => LightningRequestType)
	type: LightningRequestType;

	@Field((type) => Boolean)
	valid: boolean;

	@Field((type) => Number, {nullable: true})
	expiry: number;

	@Field((type) => String, {nullable: true})
	description: string;

	@Field((type) => Number, {nullable: true})
	offer_quantity_max: number;

	constructor(lnrequest: LightningRequest) {
		this.type = lnrequest.type;
		this.valid = lnrequest.valid;
		this.expiry = lnrequest.expiry;
		this.description = lnrequest.description;
		this.offer_quantity_max = lnrequest.offer_quantity_max;
	}
}
