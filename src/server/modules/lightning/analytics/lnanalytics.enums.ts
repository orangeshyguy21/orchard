export enum LightningAnalyticsInterval {
	hour = 'hour',
	day = 'day',
	week = 'week',
	month = 'month',
	custom = 'custom', // Aggregates entire date range into single bucket (for cumulative charts)
}

export enum LightningAnalyticsMetric {
	payments_out = 'payments_out',
	invoices_in = 'invoices_in',
	forward_fees = 'forward_fees',
	channel_opens = 'channel_opens',
	channel_closes = 'channel_closes',
	channel_opens_remote = 'channel_opens_remote',
	channel_closes_remote = 'channel_closes_remote',
}
