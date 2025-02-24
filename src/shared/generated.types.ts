export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A Unix timestamp */
  UnixTimestamp: { input: any; output: any; }
};

export type OrchardCachedEndpoint = {
  __typename?: 'OrchardCachedEndpoint';
  method: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type OrchardContact = {
  __typename?: 'OrchardContact';
  info: Scalars['String']['output'];
  method: Scalars['String']['output'];
};

export type OrchardMintBalance = {
  __typename?: 'OrchardMintBalance';
  total_issued: Scalars['Int']['output'];
  total_outstanding: Scalars['Int']['output'];
  total_redeemed: Scalars['Int']['output'];
};

export type OrchardMintDatabase = {
  __typename?: 'OrchardMintDatabase';
  db: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type OrchardMintInfo = {
  __typename?: 'OrchardMintInfo';
  contact: Array<OrchardContact>;
  description: Scalars['String']['output'];
  description_long: Scalars['String']['output'];
  icon_url: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nuts: Array<OrchardNut>;
  pubkey: Scalars['String']['output'];
  time: Scalars['UnixTimestamp']['output'];
  urls: Array<Scalars['String']['output']>;
  version: Scalars['String']['output'];
};

export type OrchardMintKeyset = {
  __typename?: 'OrchardMintKeyset';
  active: Scalars['Boolean']['output'];
  derivation_path: Scalars['String']['output'];
  encrypted_seed?: Maybe<Scalars['String']['output']>;
  first_seen: Scalars['UnixTimestamp']['output'];
  id: Scalars['ID']['output'];
  input_fee_ppk: Scalars['Int']['output'];
  seed: Scalars['String']['output'];
  seed_encryption_method?: Maybe<Scalars['String']['output']>;
  unit: Scalars['String']['output'];
  valid_from: Scalars['UnixTimestamp']['output'];
  valid_to: Scalars['UnixTimestamp']['output'];
  version: Scalars['String']['output'];
};

export type OrchardMintMeltQuote = {
  __typename?: 'OrchardMintMeltQuote';
  amount: Scalars['Int']['output'];
  change?: Maybe<Scalars['String']['output']>;
  checking_id: Scalars['String']['output'];
  created_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  expiry?: Maybe<Scalars['UnixTimestamp']['output']>;
  fee_paid?: Maybe<Scalars['Int']['output']>;
  fee_reserve?: Maybe<Scalars['Int']['output']>;
  method: Scalars['String']['output'];
  paid: Scalars['Boolean']['output'];
  paid_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  proof?: Maybe<Scalars['String']['output']>;
  quote: Scalars['ID']['output'];
  request: Scalars['String']['output'];
  state?: Maybe<Scalars['String']['output']>;
  unit: Scalars['String']['output'];
};

export type OrchardMintMintQuote = {
  __typename?: 'OrchardMintMintQuote';
  amount: Scalars['Int']['output'];
  checking_id: Scalars['String']['output'];
  created_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  issued: Scalars['Boolean']['output'];
  method: Scalars['String']['output'];
  paid: Scalars['Boolean']['output'];
  paid_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  pubkey?: Maybe<Scalars['String']['output']>;
  quote: Scalars['ID']['output'];
  request: Scalars['String']['output'];
  state?: Maybe<Scalars['String']['output']>;
  unit: Scalars['String']['output'];
};

export type OrchardMintPromise = {
  __typename?: 'OrchardMintPromise';
  amount: Scalars['Int']['output'];
  b_: Scalars['ID']['output'];
  c_: Scalars['String']['output'];
  created?: Maybe<Scalars['UnixTimestamp']['output']>;
  dleq_e?: Maybe<Scalars['String']['output']>;
  dleq_s?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  mint_quote?: Maybe<Scalars['String']['output']>;
  swap_id?: Maybe<Scalars['String']['output']>;
};

export type OrchardMintProof = {
  __typename?: 'OrchardMintProof';
  amount: Scalars['Int']['output'];
  c: Scalars['String']['output'];
  created?: Maybe<Scalars['UnixTimestamp']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  melt_quote?: Maybe<Scalars['String']['output']>;
  secret: Scalars['String']['output'];
  witness?: Maybe<Scalars['String']['output']>;
  y?: Maybe<Scalars['String']['output']>;
};

export type OrchardNut = {
  __typename?: 'OrchardNut';
  cached_endpoints?: Maybe<Array<OrchardCachedEndpoint>>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  methods?: Maybe<Array<OrchardNutMethod>>;
  nut: Scalars['Float']['output'];
  supported?: Maybe<Scalars['Boolean']['output']>;
  supported_meta?: Maybe<Array<OrchardNutSupported>>;
  ttl?: Maybe<Scalars['Float']['output']>;
};

export type OrchardNutMethod = {
  __typename?: 'OrchardNutMethod';
  description?: Maybe<Scalars['Boolean']['output']>;
  method: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type OrchardNutSupported = {
  __typename?: 'OrchardNutSupported';
  commands: Array<Scalars['String']['output']>;
  method: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type OrchardStatus = {
  __typename?: 'OrchardStatus';
  online: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  mint_balances: Array<OrchardMintBalance>;
  mint_databases: Array<OrchardMintDatabase>;
  mint_info: OrchardMintInfo;
  mint_keysets: Array<OrchardMintKeyset>;
  mint_melt_quotes: Array<OrchardMintMeltQuote>;
  mint_mint_quotes: Array<OrchardMintMintQuote>;
  mint_promises: Array<OrchardMintPromise>;
  mint_proofs_pending: Array<OrchardMintProof>;
  mint_proofs_used: Array<OrchardMintProof>;
  status: OrchardStatus;
};
