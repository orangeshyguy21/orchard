export type CashuInfo = {
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

export type CashuBalance = {
  's_issued - s_used': number;
}   

export type CashuBalanceIssued = {
  'balance': number;
}

export type CashuBalanceRedeemed = CashuBalanceIssued;

export type CashuKeyset = {
  id: string;
  derivation_path: string;
  seed: string;
  valid_from: number;
  valid_to: number;
  first_seen: number;
  active: number;
  version: string;
  unit: string;
  encrypted_seed: string|null;
  seed_encryption_method: string|null;
  input_fee_ppk: number;
}

export type CashuDbVersions = {
  db: string;
  version: number;
}