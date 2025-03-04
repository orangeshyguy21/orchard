export type CashuMintInfo = {
  name: string;
  pubkey: string;
  version: string;
  description: string;
  description_long: string;
  contact: CashuContact[];
  motd: string;
  icon_url: string;
  urls: string[];
  time: number;
  nuts: {
    [nut: string]: CashuNut;
  };
}

export type CashuContact = {
  method: string;
  info: string;
}

export type CashuNut = {
  disabled?: boolean;
  ttl?: number;
  methods?: CashuNutMethod[];
  supported?: boolean | CashuNutSupported[];
  cached_endpoints?: CashuCachedEndpoint[];
}

export type CashuNutMethod = {
  method: string;
  unit: string;
  description?: boolean;
}

export type CashuNutSupported = {
  method: string;
  unit: string;
  commands?: string[];
}

export type CashuCachedEndpoint = {
  method: string;
  path: string;
}
