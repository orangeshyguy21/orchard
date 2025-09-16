import {OrchardLightningRequest, LightningRequestType} from '@shared/generated.types';

export class LightningRequest implements OrchardLightningRequest {
	public valid: boolean;
	public type: LightningRequestType;
	public expiry: number | null;
	public description: string | null;
	public offer_quantity_max: number | null;

	constructor(olr: OrchardLightningRequest) {
		this.valid = olr.valid;
		this.type = olr.type;
		this.expiry = olr.expiry ?? null;
		this.description = olr.description ?? null;
		this.offer_quantity_max = olr.offer_quantity_max ?? null;
	}
}
