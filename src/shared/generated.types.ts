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

export enum AiAgent {
  Default = 'DEFAULT',
  MintConfig = 'MINT_CONFIG',
  MintDashboard = 'MINT_DASHBOARD',
  MintInfo = 'MINT_INFO'
}

export type AiChatAbortInput = {
  id: Scalars['String']['input'];
};

export type AiChatInput = {
  agent?: InputMaybe<AiAgent>;
  id: Scalars['String']['input'];
  messages: Array<AiChatMessageInput>;
  model: Scalars['String']['input'];
};

export type AiChatMessageInput = {
  content: Scalars['String']['input'];
  role: AiMessageRole;
};

export enum AiFunctionName {
  MintAnalyticsDateRangeUpdate = 'MINT_ANALYTICS_DATE_RANGE_UPDATE',
  MintAnalyticsIntervalUpdate = 'MINT_ANALYTICS_INTERVAL_UPDATE',
  MintAnalyticsTypeUpdate = 'MINT_ANALYTICS_TYPE_UPDATE',
  MintAnalyticsUnitsUpdate = 'MINT_ANALYTICS_UNITS_UPDATE',
  MintContactAdd = 'MINT_CONTACT_ADD',
  MintContactRemove = 'MINT_CONTACT_REMOVE',
  MintContactUpdate = 'MINT_CONTACT_UPDATE',
  MintDescriptionLongUpdate = 'MINT_DESCRIPTION_LONG_UPDATE',
  MintDescriptionUpdate = 'MINT_DESCRIPTION_UPDATE',
  MintEnabledUpdate = 'MINT_ENABLED_UPDATE',
  MintIconUrlUpdate = 'MINT_ICON_URL_UPDATE',
  MintMethodDescriptionUpdate = 'MINT_METHOD_DESCRIPTION_UPDATE',
  MintMethodMaxUpdate = 'MINT_METHOD_MAX_UPDATE',
  MintMethodMinUpdate = 'MINT_METHOD_MIN_UPDATE',
  MintMotdUpdate = 'MINT_MOTD_UPDATE',
  MintNameUpdate = 'MINT_NAME_UPDATE',
  MintQuoteTtlUpdate = 'MINT_QUOTE_TTL_UPDATE',
  MintUrlAdd = 'MINT_URL_ADD',
  MintUrlRemove = 'MINT_URL_REMOVE',
  MintUrlUpdate = 'MINT_URL_UPDATE'
}

export enum AiMessageRole {
  Assistant = 'ASSISTANT',
  Function = 'FUNCTION',
  System = 'SYSTEM',
  User = 'USER'
}

export enum MeltQuoteState {
  Paid = 'PAID',
  Pending = 'PENDING',
  Unpaid = 'UNPAID'
}

export enum MintAnalyticsInterval {
  Custom = 'custom',
  Day = 'day',
  Month = 'month',
  Week = 'week'
}

export type MintContactUpdateInput = {
  info: Scalars['String']['input'];
  method: Scalars['String']['input'];
};

export type MintDescriptionUpdateInput = {
  description: Scalars['String']['input'];
};

export type MintIconUpdateInput = {
  icon_url: Scalars['String']['input'];
};

export type MintMotdUpdateInput = {
  motd?: InputMaybe<Scalars['String']['input']>;
};

export type MintNameUpdateInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type MintNut04QuoteUpdateInput = {
  quote_id: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type MintNut04UpdateInput = {
  description?: InputMaybe<Scalars['Boolean']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  max_amount?: InputMaybe<Scalars['Int']['input']>;
  method: Scalars['String']['input'];
  min_amount?: InputMaybe<Scalars['Int']['input']>;
  unit: Scalars['String']['input'];
};

export type MintNut05UpdateInput = {
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  max_amount?: InputMaybe<Scalars['Int']['input']>;
  method: Scalars['String']['input'];
  min_amount?: InputMaybe<Scalars['Int']['input']>;
  unit: Scalars['String']['input'];
};

export enum MintQuoteState {
  Issued = 'ISSUED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Unpaid = 'UNPAID'
}

export type MintQuoteTtlUpdateInput = {
  melt_ttl?: InputMaybe<Scalars['Int']['input']>;
  mint_ttl?: InputMaybe<Scalars['Int']['input']>;
};

export type MintRotateKeysetInput = {
  input_fee_ppk?: InputMaybe<Scalars['Int']['input']>;
  max_order?: InputMaybe<Scalars['Int']['input']>;
  unit: Scalars['String']['input'];
};

export enum MintUnit {
  Auth = 'auth',
  Btc = 'btc',
  Eur = 'eur',
  Msat = 'msat',
  Sat = 'sat',
  Usd = 'usd'
}

export type MintUrlUpdateInput = {
  url: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  ai_chat_abort: OrchardAiChatStream;
  mint_contact_add: OrchardMintContactUpdate;
  mint_contact_remove: OrchardMintContactUpdate;
  mint_icon_update: OrchardMintIconUpdate;
  mint_long_description_update: OrchardMintDescriptionUpdate;
  mint_motd_update: OrchardMintMotdUpdate;
  mint_name_update: OrchardMintNameUpdate;
  mint_nut04_quote_update: OrchardMintNut04QuoteUpdate;
  mint_nut04_update: OrchardMintNut04Update;
  mint_nut05_update: OrchardMintNut05Update;
  mint_quote_ttl_update: OrchardMintQuoteTtls;
  mint_rotate_keyset: OrchardMintKeysetRotation;
  mint_short_description_update: OrchardMintDescriptionUpdate;
  mint_url_add: OrchardMintUrlUpdate;
  mint_url_remove: OrchardMintUrlUpdate;
};


export type MutationAi_Chat_AbortArgs = {
  ai_chat_abort: AiChatAbortInput;
};


export type MutationMint_Contact_AddArgs = {
  mint_contact_update: MintContactUpdateInput;
};


export type MutationMint_Contact_RemoveArgs = {
  mint_contact_update: MintContactUpdateInput;
};


export type MutationMint_Icon_UpdateArgs = {
  mint_icon_update: MintIconUpdateInput;
};


export type MutationMint_Long_Description_UpdateArgs = {
  mint_desc_update: MintDescriptionUpdateInput;
};


export type MutationMint_Motd_UpdateArgs = {
  mint_motd_update: MintMotdUpdateInput;
};


export type MutationMint_Name_UpdateArgs = {
  mint_name_update: MintNameUpdateInput;
};


export type MutationMint_Nut04_Quote_UpdateArgs = {
  mint_nut04_quote_update: MintNut04QuoteUpdateInput;
};


export type MutationMint_Nut04_UpdateArgs = {
  mint_nut04_update: MintNut04UpdateInput;
};


export type MutationMint_Nut05_UpdateArgs = {
  mint_nut05_update: MintNut05UpdateInput;
};


export type MutationMint_Quote_Ttl_UpdateArgs = {
  mint_quote_ttl_update: MintQuoteTtlUpdateInput;
};


export type MutationMint_Rotate_KeysetArgs = {
  mint_rotate_keyset: MintRotateKeysetInput;
};


export type MutationMint_Short_Description_UpdateArgs = {
  mint_desc_update: MintDescriptionUpdateInput;
};


export type MutationMint_Url_AddArgs = {
  mint_url_update: MintUrlUpdateInput;
};


export type MutationMint_Url_RemoveArgs = {
  mint_url_update: MintUrlUpdateInput;
};

export type OrchardAiChatChunk = {
  __typename?: 'OrchardAiChatChunk';
  created_at: Scalars['Int']['output'];
  done: Scalars['Boolean']['output'];
  done_reason?: Maybe<Scalars['String']['output']>;
  eval_count?: Maybe<Scalars['Float']['output']>;
  eval_duration?: Maybe<Scalars['Float']['output']>;
  id: Scalars['String']['output'];
  load_duration?: Maybe<Scalars['Float']['output']>;
  message: OrchardAiChatMessage;
  model: Scalars['String']['output'];
  prompt_eval_count?: Maybe<Scalars['Float']['output']>;
  prompt_eval_duration?: Maybe<Scalars['Float']['output']>;
  total_duration?: Maybe<Scalars['Float']['output']>;
};

export type OrchardAiChatFunction = {
  __typename?: 'OrchardAiChatFunction';
  arguments: Scalars['String']['output'];
  name: AiFunctionName;
};

export type OrchardAiChatMessage = {
  __typename?: 'OrchardAiChatMessage';
  content: Scalars['String']['output'];
  role: AiMessageRole;
  tool_calls?: Maybe<Array<OrchardAiChatToolCall>>;
};

export type OrchardAiChatStream = {
  __typename?: 'OrchardAiChatStream';
  id: Scalars['String']['output'];
};

export type OrchardAiChatToolCall = {
  __typename?: 'OrchardAiChatToolCall';
  function: OrchardAiChatFunction;
};

export type OrchardAiModel = {
  __typename?: 'OrchardAiModel';
  details: OrchardAiModelDetails;
  digest: Scalars['String']['output'];
  model: Scalars['String']['output'];
  modified_at: Scalars['UnixTimestamp']['output'];
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

export type OrchardMintContactUpdate = {
  __typename?: 'OrchardMintContactUpdate';
  info: Scalars['String']['output'];
  method: Scalars['String']['output'];
};

export type OrchardMintDatabase = {
  __typename?: 'OrchardMintDatabase';
  db: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export type OrchardMintDescriptionUpdate = {
  __typename?: 'OrchardMintDescriptionUpdate';
  description: Scalars['String']['output'];
};

export type OrchardMintIconUpdate = {
  __typename?: 'OrchardMintIconUpdate';
  icon_url: Scalars['String']['output'];
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
  description?: Maybe<Scalars['String']['output']>;
  description_long?: Maybe<Scalars['String']['output']>;
  icon_url?: Maybe<Scalars['String']['output']>;
  motd?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
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

export type OrchardMintKeysetRotation = {
  __typename?: 'OrchardMintKeysetRotation';
  id: Scalars['String']['output'];
  input_fee_ppk?: Maybe<Scalars['Int']['output']>;
  max_order?: Maybe<Scalars['Int']['output']>;
  unit: Scalars['String']['output'];
};

export type OrchardMintKeysetsAnalytics = {
  __typename?: 'OrchardMintKeysetsAnalytics';
  amount: Scalars['Int']['output'];
  created_time: Scalars['UnixTimestamp']['output'];
  keyset_id: Scalars['String']['output'];
};

export type OrchardMintMeltQuote = {
  __typename?: 'OrchardMintMeltQuote';
  amount: Scalars['Int']['output'];
  created_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  fee_reserve: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  msat_to_pay?: Maybe<Scalars['Int']['output']>;
  paid_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  payment_preimage?: Maybe<Scalars['String']['output']>;
  request: Scalars['String']['output'];
  request_lookup_id: Scalars['String']['output'];
  state: MeltQuoteState;
  unit: MintUnit;
};

export type OrchardMintMintQuote = {
  __typename?: 'OrchardMintMintQuote';
  amount: Scalars['Int']['output'];
  created_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  id: Scalars['ID']['output'];
  issued_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  paid_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  pubkey: Scalars['String']['output'];
  request: Scalars['String']['output'];
  request_lookup_id: Scalars['String']['output'];
  state: MintQuoteState;
  unit: MintUnit;
};

export type OrchardMintMotdUpdate = {
  __typename?: 'OrchardMintMotdUpdate';
  motd?: Maybe<Scalars['String']['output']>;
};

export type OrchardMintNameUpdate = {
  __typename?: 'OrchardMintNameUpdate';
  name?: Maybe<Scalars['String']['output']>;
};

export type OrchardMintNut04QuoteUpdate = {
  __typename?: 'OrchardMintNut04QuoteUpdate';
  quote_id: Scalars['String']['output'];
  state: Scalars['String']['output'];
};

export type OrchardMintNut04Update = {
  __typename?: 'OrchardMintNut04Update';
  description?: Maybe<Scalars['Boolean']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  max_amount?: Maybe<Scalars['Int']['output']>;
  method: Scalars['String']['output'];
  min_amount?: Maybe<Scalars['Int']['output']>;
  unit: Scalars['String']['output'];
};

export type OrchardMintNut05Update = {
  __typename?: 'OrchardMintNut05Update';
  disabled?: Maybe<Scalars['Boolean']['output']>;
  max_amount?: Maybe<Scalars['Int']['output']>;
  method: Scalars['String']['output'];
  min_amount?: Maybe<Scalars['Int']['output']>;
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

export type OrchardMintQuoteTtls = {
  __typename?: 'OrchardMintQuoteTtls';
  melt_ttl?: Maybe<Scalars['Int']['output']>;
  mint_ttl?: Maybe<Scalars['Int']['output']>;
};

export type OrchardMintUrlUpdate = {
  __typename?: 'OrchardMintUrlUpdate';
  url: Scalars['String']['output'];
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
  amountless?: Maybe<Scalars['Boolean']['output']>;
  max_amount?: Maybe<Scalars['Float']['output']>;
  method: Scalars['String']['output'];
  min_amount?: Maybe<Scalars['Float']['output']>;
  unit: Scalars['String']['output'];
};

export type OrchardNut15 = {
  __typename?: 'OrchardNut15';
  methods: Array<OrchardNut15Method>;
};

export type OrchardNut15Method = {
  __typename?: 'OrchardNut15Method';
  method: Scalars['String']['output'];
  unit: MintUnit;
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
  nut15: OrchardNut15;
  nut17: OrchardNut17;
  nut19: OrchardNut19;
  nut20: OrchardNutSupported;
};

export type OrchardPublicImage = {
  __typename?: 'OrchardPublicImage';
  data?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type OrchardPublicUrl = {
  __typename?: 'OrchardPublicUrl';
  has_data: Scalars['Boolean']['output'];
  ip_address?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Int']['output']>;
  url?: Maybe<Scalars['String']['output']>;
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
  mint_analytics_keysets: Array<OrchardMintKeysetsAnalytics>;
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
  mint_quote_ttl: OrchardMintQuoteTtls;
  public_image: OrchardPublicImage;
  public_urls: Array<OrchardPublicUrl>;
  status: OrchardStatus;
};


export type QueryMint_Analytics_BalancesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  interval?: InputMaybe<MintAnalyticsInterval>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Analytics_KeysetsArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  interval?: InputMaybe<MintAnalyticsInterval>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
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


export type QueryMint_BalancesArgs = {
  keyset_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMint_Melt_QuotesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  state?: InputMaybe<Array<MeltQuoteState>>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
  unit?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Mint_QuotesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  state?: InputMaybe<Array<MintQuoteState>>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
  unit?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_PromisesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  id_keysets?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryPublic_ImageArgs = {
  url: Scalars['String']['input'];
};


export type QueryPublic_UrlsArgs = {
  urls: Array<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  ai_chat: OrchardAiChatChunk;
  blockCount: OrchardBitcoinBlockCount;
};


export type SubscriptionAi_ChatArgs = {
  ai_chat: AiChatInput;
};
