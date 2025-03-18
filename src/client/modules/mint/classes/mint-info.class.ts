import { OrchardContact, OrchardNut, OrchardMintInfo } from "@shared/generated.types";

export class MintInfo implements OrchardMintInfo {

  name: string;
  pubkey: string;
  version: string;
  description: string;
  description_long: string;
  contact: OrchardContact[];
  icon_url: string | null;
  urls: string[];
  time: number;
  nuts: OrchardNut[];

  constructor(omi: OrchardMintInfo) {
    this.name = omi.name;
    this.pubkey = omi.pubkey;
    this.version = omi.version;
    this.description = omi.description;
    this.description_long = omi.description_long;
    this.contact = omi.contact;
    this.icon_url = omi.icon_url ?? null;
    this.urls = omi.urls;
    this.time = omi.time;
    this.nuts = omi.nuts;
  }
}