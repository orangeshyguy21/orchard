/* Application Dependencies */
import {LightningRequestType} from '@server/modules/lightning/lightning.enums';

export function mapRequestDescription(description: string | null): string | null {
	if (!description) return null;
	if (description === '') return null;
	return description;
}

export function mapRequestExpiry(request: any): number | null {
	if (request?.expires_at) return Number(request.expires_at);
	if (request?.expiry) return Number(request.expiry);
	return null;
}

export function mapRequestType(type?: string): LightningRequestType {
	return LightningRequestType.BOLT11_INVOICE;
}

export function mapLnbitsError(error: any): string {
	if (error?.detail) {
		if (Array.isArray(error.detail)) {
			return error.detail.map((d: any) => d.msg || d).join(', ');
		}
		return error.detail;
	}
	return error?.message || 'Unknown LNbits error';
}