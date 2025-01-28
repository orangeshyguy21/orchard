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