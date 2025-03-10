export enum MintQuoteStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    PENDING = 'PENDING',
    ISSUED = 'ISSUED'
}

export enum MeltQuoteStatus {
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

export enum MintAnalyticsInterval {
    day = 'day',
    week = 'week',
    month = 'month',
}