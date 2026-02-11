/* Shared Dependencies */
import {OrchardPublicPort} from '@shared/generated.types';

export class PublicPort implements OrchardPublicPort {
	host: string;
	port: number;
	reachable: boolean;
	error: string | null;
	latency_ms: number | null;

	/** Returns status string for use with NetworkConnectionStatusComponent */
	public get connection_status(): string {
		return this.reachable ? 'active' : 'inactive';
	}

	constructor(data: OrchardPublicPort) {
		this.host = data.host;
		this.port = data.port;
		this.reachable = data.reachable;
		this.error = data.error ?? null;
		this.latency_ms = data.latency_ms ?? null;
	}
}
