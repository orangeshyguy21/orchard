/* Shared Dependencies */
import {OrchardPublicUrl} from '@shared/generated.types';

export class PublicUrl implements OrchardPublicUrl {
	url: string | null;
	status: number | null;
	ip_address: string | null;
	has_data: boolean;

	// public get state(): string {
	//     if( this.status !== 200 ) return 'error';
	//     if( this.status === 200 && this.has_data ) return 'connected';
	//     return 'disconnected';
	// }

	constructor(data: OrchardPublicUrl) {
		this.url = data.url || null;
		this.status = data.status || null;
		this.ip_address = data.ip_address || null;
		this.has_data = data.has_data;
	}
}
