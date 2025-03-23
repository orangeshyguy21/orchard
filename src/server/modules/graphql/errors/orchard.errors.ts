export enum OrchardApiErrorCode {
	// Orchard Level Errors
	StatusError = 10001,
	// Mint Level Errors
	MintPublicApiError = 40001,
	MintDatabaseConnectionError = 40002,
	MintDatabaseSelectError = 40003,

};

export const OrchardApiErrorMessages: Record<string, string> = {
	[OrchardApiErrorCode.MintPublicApiError]: "MintPublicApiError",
	[OrchardApiErrorCode.MintDatabaseConnectionError]: "MintDatabaseConnectionError",
	[OrchardApiErrorCode.MintDatabaseSelectError]: "MintDatabaseSelectError",
	[OrchardApiErrorCode.StatusError]: "StatusError",
};