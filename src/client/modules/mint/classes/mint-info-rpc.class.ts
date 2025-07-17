import {OrchardContact, OrchardMintInfoRpc} from '@shared/generated.types';

export class MintInfoRpc implements OrchardMintInfoRpc {
	name: string | null;
	version: string;
	description: string | null;
	description_long: string | null;
	contact: OrchardContact[];
	icon_url: string | null;
	motd: string | null;
	urls: string[];
	total_issued: string | null;
	total_redeemed: string | null;

	constructor(omi: OrchardMintInfoRpc) {
		this.name = omi.name ?? null;
		this.version = omi.version;
		this.description = omi.description ?? null;
		this.description_long = omi.description_long ?? null;
		this.contact = omi.contact;
		this.icon_url = omi.icon_url ?? null;
		this.motd = omi.motd ?? null;
		this.urls = omi.urls;
		this.total_issued = omi.total_issued ?? null;
		this.total_redeemed = omi.total_redeemed ?? null;
	}
}
