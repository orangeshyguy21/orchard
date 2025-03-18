import { OrchardContact, OrchardMintInfo, OrchardNuts } from "@shared/generated.types";

export class MintInfo implements OrchardMintInfo {

	name: string;
	pubkey: string;
	version: string;
	description: string | null;
	description_long: string | null;
	contact: OrchardContact[];
	icon_url: string | null;
	urls: string[] | null;
	time: number;
	nuts: OrchardNuts

	constructor(omi: OrchardMintInfo) {
		this.name = omi.name;
		this.pubkey = omi.pubkey;
		this.version = omi.version;
		this.description = omi.description ?? null;
		this.description_long = omi.description_long ?? null;
		this.contact = omi.contact;
		this.icon_url = omi.icon_url ?? null;
		this.urls = omi.urls ?? null;
		this.time = omi.time;
		this.nuts = omi.nuts;
	}
}