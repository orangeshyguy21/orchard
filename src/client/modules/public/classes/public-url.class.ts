/* Shared Dependencies */
import {OrchardPublicUrl} from '@shared/generated.types';

export class PublicUrl implements OrchardPublicUrl {
	url: string | null;
	status: number | null;
	ip_address: string | null;
	has_data: boolean;

	/** Returns status string for use with NetworkConnectionStatusComponent */
	public get connection_status(): string {
		if (this.status !== 200) return 'inactive';
		if (!this.has_data) return 'warning';
		return 'active';
	}

	constructor(data: OrchardPublicUrl) {
		this.url = data.url || null;
		this.status = data.status || null;
		this.ip_address = data.ip_address || null;
		this.has_data = data.has_data;
	}
}
