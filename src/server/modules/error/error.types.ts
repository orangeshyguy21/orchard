export enum OrchardErrorCode {
	// Orchard Level Errors
	StatusError = 10001,
	// Bitcoin Level Errors
	BitcoinRPCError = 20001,
	// Mint Level Errors
	MintPublicApiError = 40001,
	MintDatabaseConnectionError = 40002,
	MintDatabaseSelectError = 40003,
	MintSupportError = 40004,
};

export const OrchardErrorMessages: Record<string, string> = {
	[OrchardErrorCode.MintPublicApiError]: "MintPublicApiError",
	[OrchardErrorCode.MintDatabaseConnectionError]: "MintDatabaseConnectionError",
	[OrchardErrorCode.MintDatabaseSelectError]: "MintDatabaseSelectError",
	[OrchardErrorCode.MintSupportError]: "MintSupportError",
	[OrchardErrorCode.StatusError]: "StatusError",
};