export enum MintType {
	NUTSHELL = 'nutshell',
	CDK = 'cdk',
}

export enum MintQuoteState {
	UNPAID = 'UNPAID',
	PAID = 'PAID',
	PENDING = 'PENDING',
	ISSUED = 'ISSUED',
}

export enum MeltQuoteState {
	UNPAID = 'UNPAID',
	PENDING = 'PENDING',
	PAID = 'PAID',
}

export enum MintUnit {
	sat = 'sat',
	msat = 'msat',
	usd = 'usd',
	eur = 'eur',
	btc = 'btc',
	auth = 'auth',
}

export enum MintProofState {
	SPENT = 'SPENT',
}

export enum MintPaymentMethod {
	bolt11 = 'bolt11',
	bolt12 = 'bolt12',
}
