export enum OrchardErrorCode {
	// Orchard Level Errors
	StatusError = 10001,
	PublicAssetError = 10002,
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
	MintDatabaseBackupError = 40007,
	MintDatabaseRestoreError = 40008,
	MintDatabaseRestoreInvalidError = 40009,
	// Ecash Level Errors

	// AI Level Errors
	AiError = 50001,
	AiStreamError = 50002,
	AiStreamParseError = 50003,
	// Taproot Assets Level Errors
	TaprootAssetsRpcConnectionError = 60001,
	TaprootAssetsRpcActionError = 60002,
	// 60003
	TaprootAssetsSupportError = 60004,
};

export const OrchardErrorMessages: Record<string, string> = {
	[OrchardErrorCode.StatusError]: "StatusError",
	[OrchardErrorCode.BitcoinRPCError]: "BitcoinRPCError",
	[OrchardErrorCode.LightningRpcConnectionError]: "LightningRpcConnectionError",
	[OrchardErrorCode.LightningRpcActionError]: "LightningRpcActionError",
	[OrchardErrorCode.LightningSupportError]: "LightningSupportError",
	[OrchardErrorCode.MintPublicApiError]: "MintPublicApiError",
	[OrchardErrorCode.MintDatabaseConnectionError]: "MintDatabaseConnectionError",
	[OrchardErrorCode.MintDatabaseSelectError]: "MintDatabaseSelectError",
	[OrchardErrorCode.MintSupportError]: "MintSupportError",
	[OrchardErrorCode.MintRpcConnectionError]: "MintRpcConnectionError",
	[OrchardErrorCode.MintRpcActionError]: "MintRpcActionError",
	[OrchardErrorCode.MintDatabaseBackupError]: "MintDatabaseBackupError",
	[OrchardErrorCode.MintDatabaseRestoreError]: "MintDatabaseRestoreError",
	[OrchardErrorCode.MintDatabaseRestoreInvalidError]: "MintDatabaseRestoreInvalidError",
	[OrchardErrorCode.AiError]: "AiError",
	[OrchardErrorCode.AiStreamError]: "AiStreamError",
	[OrchardErrorCode.AiStreamParseError]: "AiStreamParseError",
	[OrchardErrorCode.TaprootAssetsRpcConnectionError]: "TaprootAssetsRpcConnectionError",
	[OrchardErrorCode.TaprootAssetsRpcActionError]: "TaprootAssetsRpcActionError",
	[OrchardErrorCode.TaprootAssetsSupportError]: "TaprootAssetsSupportError",
};