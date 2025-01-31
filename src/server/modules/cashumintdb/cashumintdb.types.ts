export type CashuMintBalance = {
  's_issued - s_used': number;
}   

export type CashuMintBalanceIssued = {
  'balance': number;
}

export type CashuMintBalanceRedeemed = CashuMintBalanceIssued;

export type CashuMintKeyset = {
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

export type CashuMintDatabaseVersion = {
  db: string;
  version: number;
}