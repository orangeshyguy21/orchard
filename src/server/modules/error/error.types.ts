export enum OrchardErrorCode {
	// Orchard Level Errors
	StatusError = 10001,
	// Bitcoin Level Errors
	BitcoinRPCError = 20001,
	// Lightning Level Errors (30001 - 39999)
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
	// Ecash Level Errors (50001 - 59999)
	AiError = 50001,
	AiStreamError = 50002,
	AiStreamParseError = 50003,
};

export const OrchardErrorMessages: Record<string, string> = {
	[OrchardErrorCode.StatusError]: "StatusError",
	[OrchardErrorCode.BitcoinRPCError]: "BitcoinRPCError",
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
};