export enum OrchardErrorCode {
	// Orchard Level Errors
	StatusError = 10001,
	AuthenticationError = 10002,
	AuthenticationExpiredError = 10003,
	PublicAssetError = 10004,
	ThrottlerError = 10005,
	InitializationKeyError = 10006,
	UniqueUsernameError = 10007,
	InvalidPasswordError = 10008,
	AuthorizationError = 10009,
	InitializationError = 10010,
	// Bitcoin Level Errors
	BitcoinRPCError = 20001,
	// Lightning Level Errors
	LightningRpcConnectionError = 30001,
	LightningRpcActionError = 30002,
	// what will 300003 be?
	LightningSupportError = 30004,
	// Mint Level Errors
	MintPublicApiError = 40001,
	MintDatabaseConnectionError = 40002,
	MintDatabaseSelectError = 40003,
	MintSupportError = 40004,
	MintRpcConnectionError = 40005,
	MintRpcActionError = 40006,
	MintRpcInternalError = 40007,
	MintDatabaseBackupError = 40008,
	MintDatabaseRestoreError = 40009,
	MintDatabaseRestoreInvalidError = 40010,
	// Ecash Level Errors

	// AI Level Errors
	AiError = 50001,
	AiStreamError = 50002,
	AiStreamParseError = 50003,
	AiAgentNotFoundError = 50004,
	// Taproot Assets Level Errors
	TaprootAssetsRpcConnectionError = 60001,
	TaprootAssetsRpcActionError = 60002,
	// 60003
	TaprootAssetsSupportError = 60004,
	// User Level Errors
	UserError = 70001,
	// Invite Level Errors
	InviteError = 80001,
}

export const OrchardErrorMessages: Record<string, string> = {
	[OrchardErrorCode.StatusError]: 'StatusError',
	[OrchardErrorCode.AuthenticationError]: 'AuthenticationError',
	[OrchardErrorCode.AuthenticationExpiredError]: 'AuthenticationExpiredError',
	[OrchardErrorCode.PublicAssetError]: 'PublicAssetError',
	[OrchardErrorCode.ThrottlerError]: 'ThrottlerError',
	[OrchardErrorCode.InitializationKeyError]: 'InitializationKeyError',
	[OrchardErrorCode.UniqueUsernameError]: 'UniqueUsernameError',
	[OrchardErrorCode.InvalidPasswordError]: 'InvalidPasswordError',
	[OrchardErrorCode.AuthorizationError]: 'AuthorizationError',
	[OrchardErrorCode.InitializationError]: 'InitializationError',
	[OrchardErrorCode.BitcoinRPCError]: 'BitcoinRPCError',
	[OrchardErrorCode.LightningRpcConnectionError]: 'LightningRpcConnectionError',
	[OrchardErrorCode.LightningRpcActionError]: 'LightningRpcActionError',
	[OrchardErrorCode.LightningSupportError]: 'LightningSupportError',
	[OrchardErrorCode.MintPublicApiError]: 'MintPublicApiError',
	[OrchardErrorCode.MintDatabaseConnectionError]: 'MintDatabaseConnectionError',
	[OrchardErrorCode.MintDatabaseSelectError]: 'MintDatabaseSelectError',
	[OrchardErrorCode.MintSupportError]: 'MintSupportError',
	[OrchardErrorCode.MintRpcConnectionError]: 'MintRpcConnectionError',
	[OrchardErrorCode.MintRpcActionError]: 'MintRpcActionError',
	[OrchardErrorCode.MintRpcInternalError]: 'MintRpcInternalError',
	[OrchardErrorCode.MintDatabaseBackupError]: 'MintDatabaseBackupError',
	[OrchardErrorCode.MintDatabaseRestoreError]: 'MintDatabaseRestoreError',
	[OrchardErrorCode.MintDatabaseRestoreInvalidError]: 'MintDatabaseRestoreInvalidError',
	[OrchardErrorCode.AiError]: 'AiError',
	[OrchardErrorCode.AiStreamError]: 'AiStreamError',
	[OrchardErrorCode.AiStreamParseError]: 'AiStreamParseError',
	[OrchardErrorCode.AiAgentNotFoundError]: 'AiAgentNotFoundError',
	[OrchardErrorCode.TaprootAssetsRpcConnectionError]: 'TaprootAssetsRpcConnectionError',
	[OrchardErrorCode.TaprootAssetsRpcActionError]: 'TaprootAssetsRpcActionError',
	[OrchardErrorCode.TaprootAssetsSupportError]: 'TaprootAssetsSupportError',
	[OrchardErrorCode.UserError]: 'UserError',
	[OrchardErrorCode.InviteError]: 'InviteError',
};
