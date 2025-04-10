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
	MintRpcError = 40005,
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
	[OrchardErrorCode.MintRpcError]: "MintRpcError",
	[OrchardErrorCode.AiError]: "AiError",
	[OrchardErrorCode.AiStreamError]: "AiStreamError",
	[OrchardErrorCode.AiStreamParseError]: "AiStreamParseError",
};