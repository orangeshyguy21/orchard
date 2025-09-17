/* Application Dependencies */
import {LightningRequestType} from '@server/modules/lightning/lightning.enums';

export function mapRequestDescription(description: string | null): string | null {
	if (!description) return null;
	if (description === '') return null;
	return description;
}

export function mapRequestExpiry(request: any): number {
	if (request?.expiry) return Number(request?.timestamp) + Number(request.expiry);
	return null;
}

export function mapRequestType(): LightningRequestType {
	return LightningRequestType.BOLT11_INVOICE;
}
