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
  /** Timezone custom scalar type based on IANA timezone database */
  Timezone: { input: any; output: any; }
  /** A Unix timestamp in seconds */
  UnixTimestamp: { input: any; output: any; }
};

export type AiChatInput = {
  agent: Scalars['String']['input'];
  messages: Array<AiChatMessageInput>;
  model: Scalars['String']['input'];
};

export type AiChatMessageInput = {
  content: Scalars['String']['input'];
  role: Scalars['String']['input'];
};

export enum MintAnalyticsInterval {
  Custom = 'custom',
  Day = 'day',
  Month = 'month',
  Week = 'week'
}

export enum MintQuoteStatus {
  Issued = 'ISSUED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Unpaid = 'UNPAID'
}

export enum MintUnit {
  Auth = 'auth',
  Btc = 'btc',
  Eur = 'eur',
  Msat = 'msat',
  Sat = 'sat',
  Usd = 'usd'
}

export type Mutation = {
  __typename?: 'Mutation';
  add_mint_contact: UpdateContactOutput;
  add_mint_url: UpdateMintUrlOutput;
  remove_mint_contact: UpdateContactOutput;
  remove_mint_url: UpdateMintUrlOutput;
  rotate_next_keyset: RotateNextKeysetOutput;
  update_mint_icon: UpdateMintIconOutput;
  update_mint_long_description: UpdateMintDescriptionOutput;
  update_mint_motd: UpdateMintMotdOutput;
  update_mint_name: UpdateMintNameOutput;
  update_mint_nut04: UpdateNut04Output;
  update_mint_nut04_quote: UpdateNut04QuoteOutput;
  update_mint_nut05: UpdateNut05Output;
  update_mint_quote_ttl: UpdateQuoteTtlOutput;
  update_mint_short_description: UpdateMintDescriptionOutput;
};


export type MutationAdd_Mint_ContactArgs = {
  updateContactInput: UpdateContactInput;
};


export type MutationAdd_Mint_UrlArgs = {
  updateUrlInput: UpdateUrlInput;
};


export type MutationRemove_Mint_ContactArgs = {
  updateContactInput: UpdateContactInput;
};


export type MutationRemove_Mint_UrlArgs = {
  updateUrlInput: UpdateUrlInput;
};


export type MutationRotate_Next_KeysetArgs = {
  rotateNextKeysetInput: RotateNextKeysetInput;
};


export type MutationUpdate_Mint_IconArgs = {
  updateMintIconInput: UpdateMintIconInput;
};


export type MutationUpdate_Mint_Long_DescriptionArgs = {
  updateMintDescriptionInput: UpdateMintDescriptionInput;
};


export type MutationUpdate_Mint_MotdArgs = {
  updateMotdInput: UpdateMotdInput;
};


export type MutationUpdate_Mint_NameArgs = {
  updateMintNameInput: UpdateMintNameInput;
};


export type MutationUpdate_Mint_Nut04Args = {
  updateNut04Input: UpdateNut04Input;
};


export type MutationUpdate_Mint_Nut04_QuoteArgs = {
  updateNut04QuoteInput: UpdateNut04QuoteInput;
};


export type MutationUpdate_Mint_Nut05Args = {
  updateNut05Input: UpdateNut05Input;
};


export type MutationUpdate_Mint_Quote_TtlArgs = {
  updateQuoteTtlInput: UpdateQuoteTtlInput;
};


export type MutationUpdate_Mint_Short_DescriptionArgs = {
  updateMintDescriptionInput: UpdateMintDescriptionInput;
};

export type OrchardAiChatChunk = {
  __typename?: 'OrchardAiChatChunk';
  created_at: Scalars['Int']['output'];
  done: Scalars['Boolean']['output'];
  done_reason?: Maybe<Scalars['String']['output']>;
  eval_count?: Maybe<Scalars['Float']['output']>;
  eval_duration?: Maybe<Scalars['Float']['output']>;
  load_duration?: Maybe<Scalars['Float']['output']>;
  message: OrchardAiChatMessage;
  model: Scalars['String']['output'];
  prompt_eval_count?: Maybe<Scalars['Float']['output']>;
  prompt_eval_duration?: Maybe<Scalars['Float']['output']>;
  total_duration?: Maybe<Scalars['Float']['output']>;
};

export type OrchardAiChatMessage = {
  __typename?: 'OrchardAiChatMessage';
  content: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type OrchardAiModel = {
  __typename?: 'OrchardAiModel';
  details: OrchardAiModelDetails;
  digest: Scalars['String']['output'];
  model: Scalars['String']['output'];
  modified_at: Scalars['String']['output'];
  name: Scalars['String']['output'];
  size: Scalars['Float']['output'];
};

export type OrchardAiModelDetails = {
  __typename?: 'OrchardAiModelDetails';
  families: Array<Scalars['String']['output']>;
  family: Scalars['String']['output'];
  format: Scalars['String']['output'];
  parameter_size: Scalars['String']['output'];
  parent_model: Scalars['String']['output'];
  quantization_level: Scalars['String']['output'];
};

export type OrchardBitcoinBlockCount = {
  __typename?: 'OrchardBitcoinBlockCount';
  height: Scalars['Int']['output'];
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

export type OrchardMintAnalytics = {
  __typename?: 'OrchardMintAnalytics';
  amount: Scalars['Int']['output'];
  created_time: Scalars['UnixTimestamp']['output'];
  operation_count: Scalars['Int']['output'];
  unit: MintUnit;
};

export type OrchardMintBalance = {
  __typename?: 'OrchardMintBalance';
  balance: Scalars['Int']['output'];
  keyset: Scalars['String']['output'];
};

export type OrchardMintDatabase = {
  __typename?: 'OrchardMintDatabase';
  db: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type OrchardMintInfo = {
  __typename?: 'OrchardMintInfo';
  contact?: Maybe<Array<OrchardContact>>;
  description?: Maybe<Scalars['String']['output']>;
  description_long?: Maybe<Scalars['String']['output']>;
  icon_url?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nuts: OrchardNuts;
  pubkey?: Maybe<Scalars['String']['output']>;
  time: Scalars['UnixTimestamp']['output'];
  urls?: Maybe<Array<Scalars['String']['output']>>;
  version: Scalars['String']['output'];
};

export type OrchardMintInfoRpc = {
  __typename?: 'OrchardMintInfoRpc';
  contact: Array<OrchardContact>;
  description: Scalars['String']['output'];
  description_long?: Maybe<Scalars['String']['output']>;
  icon_url?: Maybe<Scalars['String']['output']>;
  motd?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  total_issued: Scalars['String']['output'];
  total_redeemed: Scalars['String']['output'];
  urls: Array<Scalars['String']['output']>;
  version: Scalars['String']['output'];
};

export type OrchardMintKeyset = {
  __typename?: 'OrchardMintKeyset';
  active: Scalars['Boolean']['output'];
  derivation_path: Scalars['String']['output'];
  derivation_path_index: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  input_fee_ppk: Scalars['Int']['output'];
  unit: Scalars['String']['output'];
  valid_from: Scalars['UnixTimestamp']['output'];
  valid_to?: Maybe<Scalars['UnixTimestamp']['output']>;
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
  unit: MintUnit;
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
  unit: MintUnit;
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

export type OrchardNut4 = {
  __typename?: 'OrchardNut4';
  disabled: Scalars['Boolean']['output'];
  methods: Array<OrchardNut4Method>;
};

export type OrchardNut4Method = {
  __typename?: 'OrchardNut4Method';
  description?: Maybe<Scalars['Boolean']['output']>;
  max_amount?: Maybe<Scalars['Float']['output']>;
  method: Scalars['String']['output'];
  min_amount?: Maybe<Scalars['Float']['output']>;
  unit: Scalars['String']['output'];
};

export type OrchardNut5 = {
  __typename?: 'OrchardNut5';
  disabled: Scalars['Boolean']['output'];
  methods: Array<OrchardNut5Method>;
};

export type OrchardNut5Method = {
  __typename?: 'OrchardNut5Method';
  max_amount?: Maybe<Scalars['Float']['output']>;
  method: Scalars['String']['output'];
  min_amount?: Maybe<Scalars['Float']['output']>;
  unit: Scalars['String']['output'];
};

export type OrchardNut17 = {
  __typename?: 'OrchardNut17';
  supported: Array<OrchardNut17Supported>;
};

export type OrchardNut17Supported = {
  __typename?: 'OrchardNut17Supported';
  commands: Array<Scalars['String']['output']>;
  method: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type OrchardNut19 = {
  __typename?: 'OrchardNut19';
  cached_endpoints: Array<OrchardCachedEndpoint>;
  ttl: Scalars['Float']['output'];
};

export type OrchardNutSupported = {
  __typename?: 'OrchardNutSupported';
  supported: Scalars['Boolean']['output'];
};

export type OrchardNuts = {
  __typename?: 'OrchardNuts';
  nut4: OrchardNut4;
  nut5: OrchardNut5;
  nut7: OrchardNutSupported;
  nut8: OrchardNutSupported;
  nut9: OrchardNutSupported;
  nut10: OrchardNutSupported;
  nut11: OrchardNutSupported;
  nut12: OrchardNutSupported;
  nut14: OrchardNutSupported;
  nut17: OrchardNut17;
  nut19: OrchardNut19;
  nut20: OrchardNutSupported;
};

export type OrchardStatus = {
  __typename?: 'OrchardStatus';
  online: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  ai_models: Array<OrchardAiModel>;
  bitcoin_blockcount: OrchardBitcoinBlockCount;
  mint_analytics_balances: Array<OrchardMintAnalytics>;
  mint_analytics_melts: Array<OrchardMintAnalytics>;
  mint_analytics_mints: Array<OrchardMintAnalytics>;
  mint_analytics_transfers: Array<OrchardMintAnalytics>;
  mint_balances: Array<OrchardMintBalance>;
  mint_balances_issued: Array<OrchardMintBalance>;
  mint_balances_redeemed: Array<OrchardMintBalance>;
  mint_databases: Array<OrchardMintDatabase>;
  mint_info: OrchardMintInfo;
  mint_info_rpc: OrchardMintInfoRpc;
  mint_keysets: Array<OrchardMintKeyset>;
  mint_melt_quotes: Array<OrchardMintMeltQuote>;
  mint_mint_quotes: Array<OrchardMintMintQuote>;
  mint_promises: Array<OrchardMintPromise>;
  mint_proofs_pending: Array<OrchardMintProof>;
  mint_proofs_used: Array<OrchardMintProof>;
  status: OrchardStatus;
};


export type QueryMint_Analytics_BalancesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  interval?: InputMaybe<MintAnalyticsInterval>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Analytics_MeltsArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  interval?: InputMaybe<MintAnalyticsInterval>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Analytics_MintsArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  interval?: InputMaybe<MintAnalyticsInterval>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Analytics_TransfersArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  interval?: InputMaybe<MintAnalyticsInterval>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Mint_QuotesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  status?: InputMaybe<Array<MintQuoteStatus>>;
  unit?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_PromisesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  id_keysets?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RotateNextKeysetInput = {
  input_fee_ppk?: InputMaybe<Scalars['Int']['input']>;
  max_order?: InputMaybe<Scalars['Int']['input']>;
  unit: Scalars['String']['input'];
};

export type RotateNextKeysetOutput = {
  __typename?: 'RotateNextKeysetOutput';
  id: Scalars['String']['output'];
  input_fee_ppk?: Maybe<Scalars['Int']['output']>;
  max_order?: Maybe<Scalars['Int']['output']>;
  unit: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  ai_chat: OrchardAiChatChunk;
  blockCount: OrchardBitcoinBlockCount;
};


export type SubscriptionAi_ChatArgs = {
  aiChatInput: AiChatInput;
};

export type UpdateContactInput = {
  info: Scalars['String']['input'];
  method: Scalars['String']['input'];
};

export type UpdateContactOutput = {
  __typename?: 'UpdateContactOutput';
  info: Scalars['String']['output'];
  method: Scalars['String']['output'];
};

export type UpdateMintDescriptionInput = {
  description: Scalars['String']['input'];
};

export type UpdateMintDescriptionOutput = {
  __typename?: 'UpdateMintDescriptionOutput';
  description: Scalars['String']['output'];
};

export type UpdateMintIconInput = {
  icon_url: Scalars['String']['input'];
};

export type UpdateMintIconOutput = {
  __typename?: 'UpdateMintIconOutput';
  icon_url: Scalars['String']['output'];
};

export type UpdateMintMotdOutput = {
  __typename?: 'UpdateMintMotdOutput';
  motd: Scalars['String']['output'];
};

export type UpdateMintNameInput = {
  name: Scalars['String']['input'];
};

export type UpdateMintNameOutput = {
  __typename?: 'UpdateMintNameOutput';
  name: Scalars['String']['output'];
};

export type UpdateMintUrlOutput = {
  __typename?: 'UpdateMintUrlOutput';
  url: Scalars['String']['output'];
};

export type UpdateMotdInput = {
  motd: Scalars['String']['input'];
};

export type UpdateNut04Input = {
  description?: InputMaybe<Scalars['Boolean']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  method: Scalars['String']['input'];
  min?: InputMaybe<Scalars['Int']['input']>;
  unit: Scalars['String']['input'];
};

export type UpdateNut04Output = {
  __typename?: 'UpdateNut04Output';
  description?: Maybe<Scalars['Boolean']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  max?: Maybe<Scalars['Int']['output']>;
  method: Scalars['String']['output'];
  min?: Maybe<Scalars['Int']['output']>;
  unit: Scalars['String']['output'];
};

export type UpdateNut04QuoteInput = {
  quote_id: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type UpdateNut04QuoteOutput = {
  __typename?: 'UpdateNut04QuoteOutput';
  quote_id: Scalars['String']['output'];
  state: Scalars['String']['output'];
};

export type UpdateNut05Input = {
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  max?: InputMaybe<Scalars['Int']['input']>;
  method: Scalars['String']['input'];
  min?: InputMaybe<Scalars['Int']['input']>;
  unit: Scalars['String']['input'];
};

export type UpdateNut05Output = {
  __typename?: 'UpdateNut05Output';
  disabled?: Maybe<Scalars['Boolean']['output']>;
  max?: Maybe<Scalars['Int']['output']>;
  method: Scalars['String']['output'];
  min?: Maybe<Scalars['Int']['output']>;
  unit: Scalars['String']['output'];
};

export type UpdateQuoteTtlInput = {
  melt_ttl?: InputMaybe<Scalars['Int']['input']>;
  mint_ttl?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateQuoteTtlOutput = {
  __typename?: 'UpdateQuoteTtlOutput';
  melt_ttl?: Maybe<Scalars['Int']['output']>;
  mint_ttl?: Maybe<Scalars['Int']['output']>;
};

export type UpdateUrlInput = {
  url: Scalars['String']['input'];
};
