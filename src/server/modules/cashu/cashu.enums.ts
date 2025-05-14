export enum MintQuoteState {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    PENDING = 'PENDING',
    ISSUED = 'ISSUED'
}

export enum MeltQuoteState {
    UNPAID = 'UNPAID',
    PENDING = 'PENDING',
    PAID = 'PAID'
}

export enum MintUnit {
    sat = "sat",
    msat = "msat",
    usd = "usd",
    eur = "eur",
    btc = "btc",
    auth = "auth"
}