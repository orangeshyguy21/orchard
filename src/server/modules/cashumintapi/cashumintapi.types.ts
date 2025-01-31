export type CashuMintInfo = {
  name: string;
  pubkey: string;
  version: string;
  description: string;
  description_long: string;
  contact: string[];
  motd: string;
  icon_url: string;
  urls: string[];
  time: number;
  nuts: {
    [nut: string]: CashuNut;
  };
}

export type CashuNut = {
  disabled?: boolean;
  methods?: CashuNutMethod[];
  supported?: boolean | CashuNutSupported[];
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