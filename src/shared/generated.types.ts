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
  /** Base64 encoded string scalar type */
  Base64: { input: any; output: any; }
  /** Timezone custom scalar type based on IANA timezone database */
  Timezone: { input: any; output: any; }
  /** A Unix timestamp in seconds */
  UnixTimestamp: { input: any; output: any; }
};

export enum AiAgent {
  Default = 'DEFAULT',
  MintBackup = 'MINT_BACKUP',
  MintConfig = 'MINT_CONFIG',
  MintDashboard = 'MINT_DASHBOARD',
  MintDatabase = 'MINT_DATABASE',
  MintInfo = 'MINT_INFO',
  MintKeysets = 'MINT_KEYSETS',
  MintKeysetRotation = 'MINT_KEYSET_ROTATION'
}

export type AiChatAbortInput = {
  id: Scalars['String']['input'];
};

export type AiChatInput = {
  agent?: InputMaybe<AiAgent>;
  auth: Scalars['String']['input'];
  id: Scalars['String']['input'];
  messages: Array<AiChatMessageInput>;
  model: Scalars['String']['input'];
};

export type AiChatMessageInput = {
  content: Scalars['String']['input'];
  role: AiMessageRole;
  thinking?: InputMaybe<Scalars['String']['input']>;
};

export enum AiFunctionName {
  MintAnalyticsDateRangeUpdate = 'MINT_ANALYTICS_DATE_RANGE_UPDATE',
  MintAnalyticsIntervalUpdate = 'MINT_ANALYTICS_INTERVAL_UPDATE',
  MintAnalyticsTypeUpdate = 'MINT_ANALYTICS_TYPE_UPDATE',
  MintAnalyticsUnitsUpdate = 'MINT_ANALYTICS_UNITS_UPDATE',
  MintBackupFilenameUpdate = 'MINT_BACKUP_FILENAME_UPDATE',
  MintContactAdd = 'MINT_CONTACT_ADD',
  MintContactRemove = 'MINT_CONTACT_REMOVE',
  MintContactUpdate = 'MINT_CONTACT_UPDATE',
  MintDatabaseDataTypeUpdate = 'MINT_DATABASE_DATA_TYPE_UPDATE',
  MintDatabaseStatesUpdate = 'MINT_DATABASE_STATES_UPDATE',
  MintDescriptionLongUpdate = 'MINT_DESCRIPTION_LONG_UPDATE',
  MintDescriptionUpdate = 'MINT_DESCRIPTION_UPDATE',
  MintEnabledUpdate = 'MINT_ENABLED_UPDATE',
  MintIconUrlUpdate = 'MINT_ICON_URL_UPDATE',
  MintKeysetRotationInputFeePpkUpdate = 'MINT_KEYSET_ROTATION_INPUT_FEE_PPK_UPDATE',
  MintKeysetRotationMaxOrderUpdate = 'MINT_KEYSET_ROTATION_MAX_ORDER_UPDATE',
  MintKeysetRotationUnitUpdate = 'MINT_KEYSET_ROTATION_UNIT_UPDATE',
  MintKeysetStatusUpdate = 'MINT_KEYSET_STATUS_UPDATE',
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
  Error = 'ERROR',
  Function = 'FUNCTION',
  System = 'SYSTEM',
  User = 'USER'
}

export type AuthenticationInput = {
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type InitializationInput = {
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type InviteCreateInput = {
  expires_at?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
};

export type InviteUpdateInput = {
  expires_at?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  id: Scalars['String']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export enum LightningAddressType {
  HybridNestedWitnessPubkeyHash = 'HYBRID_NESTED_WITNESS_PUBKEY_HASH',
  NestedWitnessPubkeyHash = 'NESTED_WITNESS_PUBKEY_HASH',
  TaprootPubkey = 'TAPROOT_PUBKEY',
  Unkown = 'UNKOWN',
  WitnessPubkeyHash = 'WITNESS_PUBKEY_HASH'
}

export enum LightningRequestType {
  Bolt11Invoice = 'BOLT11_INVOICE',
  Bolt12Invoice = 'BOLT12_INVOICE',
  Bolt12InvoiceRequest = 'BOLT12_INVOICE_REQUEST',
  Bolt12Offer = 'BOLT12_OFFER',
  Unknown = 'UNKNOWN'
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

export enum MintPaymentMethod {
  Bolt11 = 'bolt11',
  Bolt12 = 'bolt12'
}

export enum MintProofState {
  Spent = 'SPENT'
}

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
  auth_authentication: OrchardAuthentication;
  auth_authentication_refresh: OrchardAuthentication;
  auth_authentication_revoke: Scalars['Boolean']['output'];
  auth_initialize: OrchardAuthentication;
  crew_invite_create: OrchardCrewInvite;
  crew_invite_update: OrchardCrewInvite;
  crew_user_update_name: OrchardCrewUser;
  crew_user_update_password: OrchardCrewUser;
  mint_contact_add: OrchardMintContactUpdate;
  mint_contact_remove: OrchardMintContactUpdate;
  mint_database_backup: OrchardMintDatabaseBackup;
  mint_database_restore: OrchardMintDatabaseRestore;
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


export type MutationAuth_AuthenticationArgs = {
  authentication: AuthenticationInput;
};


export type MutationAuth_InitializeArgs = {
  initialize: InitializationInput;
};


export type MutationCrew_Invite_CreateArgs = {
  createInvite: InviteCreateInput;
};


export type MutationCrew_Invite_UpdateArgs = {
  updateInvite: InviteUpdateInput;
};


export type MutationCrew_User_Update_NameArgs = {
  updateUserName: UserNameUpdateInput;
};


export type MutationCrew_User_Update_PasswordArgs = {
  updateUserPassword: UserPasswordUpdateInput;
};


export type MutationMint_Contact_AddArgs = {
  mint_contact_update: MintContactUpdateInput;
};


export type MutationMint_Contact_RemoveArgs = {
  mint_contact_update: MintContactUpdateInput;
};


export type MutationMint_Database_RestoreArgs = {
  filebase64: Scalars['Base64']['input'];
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

export type OrchardAiAgent = {
  __typename?: 'OrchardAiAgent';
  description: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  name: Scalars['String']['output'];
  section?: Maybe<Scalars['String']['output']>;
  system_message: OrchardAiAgentSystemMessage;
  tools: Array<OrchardAiAgentTool>;
};

export type OrchardAiAgentSystemMessage = {
  __typename?: 'OrchardAiAgentSystemMessage';
  content: Scalars['String']['output'];
  role: Scalars['String']['output'];
};

export type OrchardAiAgentTool = {
  __typename?: 'OrchardAiAgentTool';
  function: OrchardAiAgentToolFunction;
  type: Scalars['String']['output'];
};

export type OrchardAiAgentToolFunction = {
  __typename?: 'OrchardAiAgentToolFunction';
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  parameters: OrchardAiAgentToolParameters;
};

export type OrchardAiAgentToolParameters = {
  __typename?: 'OrchardAiAgentToolParameters';
  properties: Scalars['String']['output'];
  required: Array<Scalars['String']['output']>;
  type: Scalars['String']['output'];
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
  thinking?: Maybe<Scalars['String']['output']>;
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

export type OrchardAuthentication = {
  __typename?: 'OrchardAuthentication';
  access_token: Scalars['String']['output'];
  refresh_token: Scalars['String']['output'];
};

export type OrchardBitcoinBlock = {
  __typename?: 'OrchardBitcoinBlock';
  chainwork: Scalars['String']['output'];
  feerate_high: Scalars['Float']['output'];
  feerate_low: Scalars['Float']['output'];
  hash: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  nTx: Scalars['Int']['output'];
  time: Scalars['UnixTimestamp']['output'];
  weight: Scalars['Float']['output'];
};

export type OrchardBitcoinBlockCount = {
  __typename?: 'OrchardBitcoinBlockCount';
  height: Scalars['Int']['output'];
};

export type OrchardBitcoinBlockTemplate = {
  __typename?: 'OrchardBitcoinBlockTemplate';
  feerate_high: Scalars['Float']['output'];
  feerate_low: Scalars['Float']['output'];
  height: Scalars['Int']['output'];
  nTx: Scalars['Int']['output'];
  weight: Scalars['Int']['output'];
};

export type OrchardBitcoinBlockchainInfo = {
  __typename?: 'OrchardBitcoinBlockchainInfo';
  automatic_pruning?: Maybe<Scalars['Boolean']['output']>;
  bestblockhash: Scalars['String']['output'];
  blocks: Scalars['Int']['output'];
  chain: Scalars['String']['output'];
  chainwork: Scalars['String']['output'];
  difficulty: Scalars['Float']['output'];
  headers: Scalars['Int']['output'];
  initialblockdownload: Scalars['Boolean']['output'];
  prune_target_size?: Maybe<Scalars['Int']['output']>;
  pruned: Scalars['Boolean']['output'];
  pruneheight?: Maybe<Scalars['Int']['output']>;
  size_on_disk: Scalars['Float']['output'];
  verificationprogress: Scalars['Float']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type OrchardBitcoinMempoolFees = {
  __typename?: 'OrchardBitcoinMempoolFees';
  ancestor: Scalars['Float']['output'];
  base: Scalars['Float']['output'];
  descendant: Scalars['Float']['output'];
  modified: Scalars['Float']['output'];
};

export type OrchardBitcoinMempoolTransaction = {
  __typename?: 'OrchardBitcoinMempoolTransaction';
  ancestorcount: Scalars['Int']['output'];
  ancestorsize: Scalars['Int']['output'];
  bip125_replaceable: Scalars['Boolean']['output'];
  depends: Array<Scalars['String']['output']>;
  descendantcount: Scalars['Int']['output'];
  descendantsize: Scalars['Int']['output'];
  fees: OrchardBitcoinMempoolFees;
  height: Scalars['Int']['output'];
  spentby: Array<Scalars['String']['output']>;
  time: Scalars['UnixTimestamp']['output'];
  txid: Scalars['ID']['output'];
  unbroadcast: Scalars['Boolean']['output'];
  vsize: Scalars['Int']['output'];
  weight: Scalars['Int']['output'];
  wtxid: Scalars['String']['output'];
};

export type OrchardBitcoinNetwork = {
  __typename?: 'OrchardBitcoinNetwork';
  limited: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  proxy: Scalars['String']['output'];
  proxy_randomize_credentials: Scalars['Boolean']['output'];
  reachable: Scalars['Boolean']['output'];
};

export type OrchardBitcoinNetworkAddress = {
  __typename?: 'OrchardBitcoinNetworkAddress';
  address: Scalars['String']['output'];
  port: Scalars['Int']['output'];
  score: Scalars['Int']['output'];
};

export type OrchardBitcoinNetworkInfo = {
  __typename?: 'OrchardBitcoinNetworkInfo';
  connections: Scalars['Int']['output'];
  connections_in: Scalars['Int']['output'];
  connections_out: Scalars['Int']['output'];
  incrementalfee: Scalars['Float']['output'];
  localaddresses: Array<OrchardBitcoinNetworkAddress>;
  localrelay: Scalars['Boolean']['output'];
  localservices: Scalars['String']['output'];
  localservicesnames: Array<Scalars['String']['output']>;
  networkactive: Scalars['Boolean']['output'];
  networks: Array<OrchardBitcoinNetwork>;
  protocolversion: Scalars['Int']['output'];
  relayfee: Scalars['Float']['output'];
  subversion: Scalars['String']['output'];
  timeoffset: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type OrchardBitcoinOracle = {
  __typename?: 'OrchardBitcoinOracle';
  block_window: OrchardBitcoinOracleBlockWindow;
  bounds: OrchardBitcoinOracleBounds;
  central_price: Scalars['Float']['output'];
  deviation_pct: Scalars['Float']['output'];
  intraday?: Maybe<Array<OrchardBitcoinOracleIntradayPoint>>;
  rough_price_estimate: Scalars['Float']['output'];
};

export type OrchardBitcoinOracleBlockWindow = {
  __typename?: 'OrchardBitcoinOracleBlockWindow';
  end: Scalars['Int']['output'];
  start: Scalars['Int']['output'];
};

export type OrchardBitcoinOracleBounds = {
  __typename?: 'OrchardBitcoinOracleBounds';
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
};

export type OrchardBitcoinOracleIntradayPoint = {
  __typename?: 'OrchardBitcoinOracleIntradayPoint';
  block_height: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  timestamp: Scalars['Int']['output'];
};

export type OrchardBitcoinTxFeeEstimate = {
  __typename?: 'OrchardBitcoinTxFeeEstimate';
  blocks: Scalars['Int']['output'];
  errors?: Maybe<Array<Scalars['String']['output']>>;
  feerate?: Maybe<Scalars['Float']['output']>;
  target: Scalars['Int']['output'];
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

export type OrchardCrewInvite = {
  __typename?: 'OrchardCrewInvite';
  claimed_by_id?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['UnixTimestamp']['output'];
  created_by_id: Scalars['String']['output'];
  expires_at?: Maybe<Scalars['UnixTimestamp']['output']>;
  id: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  token: Scalars['String']['output'];
  used_at?: Maybe<Scalars['UnixTimestamp']['output']>;
};

export type OrchardCrewUser = {
  __typename?: 'OrchardCrewUser';
  active: Scalars['Boolean']['output'];
  created_at: Scalars['UnixTimestamp']['output'];
  id: Scalars['String']['output'];
  label?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  role: UserRole;
};

export type OrchardCustomChannel = {
  __typename?: 'OrchardCustomChannel';
  asset_id: Scalars['String']['output'];
  chan_id: Scalars['String']['output'];
  local_balance: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  remote_balance: Scalars['Float']['output'];
};

export type OrchardCustomChannelData = {
  __typename?: 'OrchardCustomChannelData';
  open_channels: Array<OrchardCustomChannel>;
  pending_channels: Array<OrchardCustomChannel>;
};

export type OrchardInitialization = {
  __typename?: 'OrchardInitialization';
  initialization: Scalars['Boolean']['output'];
};

export type OrchardLightningAccount = {
  __typename?: 'OrchardLightningAccount';
  address_type: LightningAddressType;
  addresses: Array<OrchardLightningAddress>;
  derivation_path: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type OrchardLightningAddress = {
  __typename?: 'OrchardLightningAddress';
  address: Scalars['String']['output'];
  balance: Scalars['Float']['output'];
  derivation_path: Scalars['String']['output'];
  is_internal: Scalars['String']['output'];
  public_key: Scalars['Base64']['output'];
};

export type OrchardLightningBalance = {
  __typename?: 'OrchardLightningBalance';
  balance: Scalars['Float']['output'];
  custom_channel_data: OrchardCustomChannelData;
  local_balance: OrchardLightningBalanceAmount;
  pending_open_balance: Scalars['Float']['output'];
  pending_open_local_balance: OrchardLightningBalanceAmount;
  pending_open_remote_balance: OrchardLightningBalanceAmount;
  remote_balance: OrchardLightningBalanceAmount;
  unsettled_local_balance: OrchardLightningBalanceAmount;
  unsettled_remote_balance: OrchardLightningBalanceAmount;
};

export type OrchardLightningBalanceAmount = {
  __typename?: 'OrchardLightningBalanceAmount';
  msat: Scalars['Float']['output'];
  sat: Scalars['Float']['output'];
};

export type OrchardLightningChain = {
  __typename?: 'OrchardLightningChain';
  chain: Scalars['String']['output'];
  network: Scalars['String']['output'];
};

export type OrchardLightningFeature = {
  __typename?: 'OrchardLightningFeature';
  bit: Scalars['Int']['output'];
  is_known: Scalars['Boolean']['output'];
  is_required: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type OrchardLightningInfo = {
  __typename?: 'OrchardLightningInfo';
  alias: Scalars['String']['output'];
  best_header_timestamp: Scalars['UnixTimestamp']['output'];
  block_hash: Scalars['String']['output'];
  block_height: Scalars['Int']['output'];
  chains: Array<OrchardLightningChain>;
  color: Scalars['String']['output'];
  commit_hash: Scalars['String']['output'];
  features: Array<OrchardLightningFeature>;
  identity_pubkey: Scalars['String']['output'];
  num_active_channels: Scalars['Int']['output'];
  num_inactive_channels: Scalars['Int']['output'];
  num_peers: Scalars['Int']['output'];
  num_pending_channels: Scalars['Int']['output'];
  require_htlc_interceptor: Scalars['Boolean']['output'];
  store_final_htlc_resolutions: Scalars['Boolean']['output'];
  synced_to_chain: Scalars['Boolean']['output'];
  synced_to_graph: Scalars['Boolean']['output'];
  testnet: Scalars['Boolean']['output'];
  uris: Array<Scalars['String']['output']>;
  version: Scalars['String']['output'];
};

export type OrchardLightningRequest = {
  __typename?: 'OrchardLightningRequest';
  description?: Maybe<Scalars['String']['output']>;
  expiry?: Maybe<Scalars['Float']['output']>;
  offer_quantity_max?: Maybe<Scalars['Float']['output']>;
  type: LightningRequestType;
  valid: Scalars['Boolean']['output'];
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

export type OrchardMintCount = {
  __typename?: 'OrchardMintCount';
  count: Scalars['Int']['output'];
};

export type OrchardMintDatabaseBackup = {
  __typename?: 'OrchardMintDatabaseBackup';
  filebase64: Scalars['Base64']['output'];
};

export type OrchardMintDatabaseRestore = {
  __typename?: 'OrchardMintDatabaseRestore';
  success: Scalars['Boolean']['output'];
};

export type OrchardMintDescriptionUpdate = {
  __typename?: 'OrchardMintDescriptionUpdate';
  description: Scalars['String']['output'];
};

export type OrchardMintFee = {
  __typename?: 'OrchardMintFee';
  backend_balance: Scalars['Int']['output'];
  keyset_balance: Scalars['Int']['output'];
  keyset_fees_paid: Scalars['Int']['output'];
  time: Scalars['UnixTimestamp']['output'];
  unit: MintUnit;
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
  time?: Maybe<Scalars['UnixTimestamp']['output']>;
  tos_url?: Maybe<Scalars['String']['output']>;
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
  total_issued?: Maybe<Scalars['String']['output']>;
  total_redeemed?: Maybe<Scalars['String']['output']>;
  urls: Array<Scalars['String']['output']>;
  version: Scalars['String']['output'];
};

export type OrchardMintKeyset = {
  __typename?: 'OrchardMintKeyset';
  active: Scalars['Boolean']['output'];
  derivation_path: Scalars['String']['output'];
  derivation_path_index: Scalars['Int']['output'];
  fees_paid?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  input_fee_ppk?: Maybe<Scalars['Int']['output']>;
  unit: Scalars['String']['output'];
  valid_from: Scalars['UnixTimestamp']['output'];
  valid_to?: Maybe<Scalars['UnixTimestamp']['output']>;
};

export type OrchardMintKeysetProofCount = {
  __typename?: 'OrchardMintKeysetProofCount';
  count: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
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
  created_time: Scalars['UnixTimestamp']['output'];
  fee_reserve: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  msat_to_pay?: Maybe<Scalars['Int']['output']>;
  paid_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  payment_method: MintPaymentMethod;
  payment_preimage?: Maybe<Scalars['String']['output']>;
  request: Scalars['String']['output'];
  request_lookup_id?: Maybe<Scalars['String']['output']>;
  state: MeltQuoteState;
  unit: MintUnit;
};

export type OrchardMintMintQuote = {
  __typename?: 'OrchardMintMintQuote';
  amount?: Maybe<Scalars['Int']['output']>;
  amount_issued: Scalars['Int']['output'];
  amount_paid: Scalars['Int']['output'];
  created_time: Scalars['UnixTimestamp']['output'];
  id: Scalars['ID']['output'];
  issued_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  paid_time?: Maybe<Scalars['UnixTimestamp']['output']>;
  payment_method: MintPaymentMethod;
  pubkey?: Maybe<Scalars['String']['output']>;
  request: Scalars['String']['output'];
  request_lookup_id?: Maybe<Scalars['String']['output']>;
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

export type OrchardMintPromiseGroup = {
  __typename?: 'OrchardMintPromiseGroup';
  amount: Scalars['Int']['output'];
  amounts: Array<Array<Scalars['Int']['output']>>;
  created_time: Scalars['UnixTimestamp']['output'];
  keyset_ids: Array<Scalars['String']['output']>;
  unit: MintUnit;
};

export type OrchardMintProofGroup = {
  __typename?: 'OrchardMintProofGroup';
  amount: Scalars['Int']['output'];
  amounts: Array<Array<Scalars['Int']['output']>>;
  created_time: Scalars['UnixTimestamp']['output'];
  keyset_ids: Array<Scalars['String']['output']>;
  state: MintProofState;
  unit: MintUnit;
};

export type OrchardMintProofGroupStats = {
  __typename?: 'OrchardMintProofGroupStats';
  median: Scalars['Float']['output'];
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
  method: MintPaymentMethod;
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
  method: MintPaymentMethod;
  min_amount?: Maybe<Scalars['Float']['output']>;
  unit: Scalars['String']['output'];
};

export type OrchardNut15 = {
  __typename?: 'OrchardNut15';
  methods: Array<OrchardNut15Method>;
};

export type OrchardNut15Method = {
  __typename?: 'OrchardNut15Method';
  method: MintPaymentMethod;
  unit: MintUnit;
};

export type OrchardNut17 = {
  __typename?: 'OrchardNut17';
  supported: Array<OrchardNut17Supported>;
};

export type OrchardNut17Supported = {
  __typename?: 'OrchardNut17Supported';
  commands: Array<Scalars['String']['output']>;
  method: MintPaymentMethod;
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
  nut14?: Maybe<OrchardNutSupported>;
  nut15?: Maybe<OrchardNut15>;
  nut17?: Maybe<OrchardNut17>;
  nut19?: Maybe<OrchardNut19>;
  nut20?: Maybe<OrchardNutSupported>;
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

export type OrchardTaprootAsset = {
  __typename?: 'OrchardTaprootAsset';
  amount: Scalars['String']['output'];
  asset_genesis: OrchardTaprootAssetGenesis;
  asset_group?: Maybe<Scalars['String']['output']>;
  decimal_display: OrchardTaprootAssetDecimalDisplay;
  is_burn: Scalars['Boolean']['output'];
  is_spent: Scalars['Boolean']['output'];
  version: TaprootAssetVersion;
};

export type OrchardTaprootAssetDecimalDisplay = {
  __typename?: 'OrchardTaprootAssetDecimalDisplay';
  decimal_display: Scalars['Int']['output'];
};

export type OrchardTaprootAssetGenesis = {
  __typename?: 'OrchardTaprootAssetGenesis';
  asset_id: Scalars['Base64']['output'];
  asset_type: TaprootAssetType;
  genesis_point: Scalars['String']['output'];
  name: Scalars['String']['output'];
  output_index: Scalars['Int']['output'];
};

export type OrchardTaprootAssets = {
  __typename?: 'OrchardTaprootAssets';
  assets: Array<OrchardTaprootAsset>;
  unconfirmed_mints: Scalars['String']['output'];
  unconfirmed_transfers: Scalars['String']['output'];
};

export type OrchardTaprootAssetsInfo = {
  __typename?: 'OrchardTaprootAssetsInfo';
  block_hash: Scalars['String']['output'];
  block_height: Scalars['Int']['output'];
  lnd_identity_pubkey: Scalars['String']['output'];
  lnd_version: Scalars['String']['output'];
  network: Scalars['String']['output'];
  node_alias: Scalars['String']['output'];
  sync_to_chain: Scalars['Boolean']['output'];
  version: Scalars['String']['output'];
};

export type OrchardTaprootAssetsUtxo = {
  __typename?: 'OrchardTaprootAssetsUtxo';
  amt_sat: Scalars['Float']['output'];
  assets: Array<OrchardTaprootAsset>;
  id: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  ai_agent: OrchardAiAgent;
  ai_models: Array<OrchardAiModel>;
  auth_initialization: OrchardInitialization;
  bitcoin_block: OrchardBitcoinBlock;
  bitcoin_block_template: OrchardBitcoinBlockTemplate;
  bitcoin_blockchain_info: OrchardBitcoinBlockchainInfo;
  bitcoin_blockcount: OrchardBitcoinBlockCount;
  bitcoin_mempool_transactions: Array<OrchardBitcoinMempoolTransaction>;
  bitcoin_network_info: OrchardBitcoinNetworkInfo;
  bitcoin_oracle: OrchardBitcoinOracle;
  bitcoin_transaction_fee_estimates: Array<OrchardBitcoinTxFeeEstimate>;
  crew_invites: Array<OrchardCrewInvite>;
  crew_user: OrchardCrewUser;
  crew_users: Array<OrchardCrewUser>;
  lightning_balance: OrchardLightningBalance;
  lightning_info: OrchardLightningInfo;
  lightning_request: OrchardLightningRequest;
  lightning_wallet: Array<OrchardLightningAccount>;
  mint_analytics_balances: Array<OrchardMintAnalytics>;
  mint_analytics_fees: Array<OrchardMintAnalytics>;
  mint_analytics_keysets: Array<OrchardMintKeysetsAnalytics>;
  mint_analytics_melts: Array<OrchardMintAnalytics>;
  mint_analytics_mints: Array<OrchardMintAnalytics>;
  mint_analytics_swaps: Array<OrchardMintAnalytics>;
  mint_balances: Array<OrchardMintBalance>;
  mint_balances_issued: Array<OrchardMintBalance>;
  mint_balances_redeemed: Array<OrchardMintBalance>;
  mint_count_melt_quotes: OrchardMintCount;
  mint_count_mint_quotes: OrchardMintCount;
  mint_count_promise_groups: OrchardMintCount;
  mint_count_proof_groups: OrchardMintCount;
  mint_fees: Array<OrchardMintFee>;
  mint_info: OrchardMintInfo;
  mint_info_rpc: OrchardMintInfoRpc;
  mint_keyset_proof_counts: Array<OrchardMintKeysetProofCount>;
  mint_keysets: Array<OrchardMintKeyset>;
  mint_melt_quotes: Array<OrchardMintMeltQuote>;
  mint_mint_quotes: Array<OrchardMintMintQuote>;
  mint_promise_groups: Array<OrchardMintPromiseGroup>;
  mint_proof_group_stats: OrchardMintProofGroupStats;
  mint_proof_groups: Array<OrchardMintProofGroup>;
  mint_quote_ttl: OrchardMintQuoteTtls;
  public_image: OrchardPublicImage;
  public_urls: Array<OrchardPublicUrl>;
  status: OrchardStatus;
  taproot_assets: OrchardTaprootAssets;
  taproot_assets_info: OrchardTaprootAssetsInfo;
  taproot_assets_utxo: Array<OrchardTaprootAssetsUtxo>;
};


export type QueryAi_AgentArgs = {
  agent: AiAgent;
};


export type QueryBitcoin_BlockArgs = {
  hash: Scalars['String']['input'];
};


export type QueryBitcoin_OracleArgs = {
  date: Scalars['String']['input'];
  intraday?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryBitcoin_Transaction_Fee_EstimatesArgs = {
  targets: Array<Scalars['Int']['input']>;
};


export type QueryLightning_RequestArgs = {
  request: Scalars['String']['input'];
};


export type QueryMint_Analytics_BalancesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  interval?: InputMaybe<MintAnalyticsInterval>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Analytics_FeesArgs = {
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


export type QueryMint_Analytics_SwapsArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  interval?: InputMaybe<MintAnalyticsInterval>;
  timezone?: InputMaybe<Scalars['Timezone']['input']>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_BalancesArgs = {
  keyset_id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMint_Count_Melt_QuotesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  states?: InputMaybe<Array<MeltQuoteState>>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Count_Mint_QuotesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  states?: InputMaybe<Array<MintQuoteState>>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Count_Promise_GroupsArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  id_keysets?: InputMaybe<Array<Scalars['String']['input']>>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Count_Proof_GroupsArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  id_keysets?: InputMaybe<Array<Scalars['String']['input']>>;
  states?: InputMaybe<Array<MintProofState>>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_FeesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMint_Keyset_Proof_CountsArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  id_keysets?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryMint_Melt_QuotesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  page_size?: InputMaybe<Scalars['Int']['input']>;
  states?: InputMaybe<Array<MeltQuoteState>>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Mint_QuotesArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  page_size?: InputMaybe<Scalars['Int']['input']>;
  states?: InputMaybe<Array<MintQuoteState>>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Promise_GroupsArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  id_keysets?: InputMaybe<Array<Scalars['String']['input']>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  page_size?: InputMaybe<Scalars['Int']['input']>;
  units?: InputMaybe<Array<MintUnit>>;
};


export type QueryMint_Proof_Group_StatsArgs = {
  unit: MintUnit;
};


export type QueryMint_Proof_GroupsArgs = {
  date_end?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  date_start?: InputMaybe<Scalars['UnixTimestamp']['input']>;
  id_keysets?: InputMaybe<Array<Scalars['String']['input']>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  page_size?: InputMaybe<Scalars['Int']['input']>;
  states?: InputMaybe<Array<MintProofState>>;
  units?: InputMaybe<Array<MintUnit>>;
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

export enum TaprootAssetType {
  Collectible = 'COLLECTIBLE',
  Normal = 'NORMAL',
  Tapd = 'TAPD'
}

export enum TaprootAssetVersion {
  AssetVersionV0 = 'ASSET_VERSION_V0',
  AssetVersionV1 = 'ASSET_VERSION_V1'
}

export type UserNameUpdateInput = {
  name: Scalars['String']['input'];
};

export type UserPasswordUpdateInput = {
  password_new: Scalars['String']['input'];
  password_old: Scalars['String']['input'];
};

export enum UserRole {
  Admin = 'ADMIN',
  Manager = 'MANAGER',
  Reader = 'READER'
}
