/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {ErrorService} from '@server/modules/error/error.service';
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {TimezoneType} from '@server/modules/graphql/scalars/timezone.scalar';
import {MintAnalyticsInterval} from '@server/modules/cashu/mintdb/cashumintdb.enums';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Local Dependencies */
import {OrchardLightningAnalytics} from './lnanalytics.model';

type AnalyticsArgs = {
	date_start?: number;
	date_end?: number;
	interval?: MintAnalyticsInterval;
	timezone?: TimezoneType;
};

@Injectable()
export class LightningAnalyticsService {
	private readonly logger = new Logger(LightningAnalyticsService.name);

	constructor(
		private lightningService: LightningService,
		private errorService: ErrorService,
	) {}

	async getOutboundLiquiditySeries(tag: string, args: AnalyticsArgs): Promise<OrchardLightningAnalytics[]> {
		try {
			const timezone = args.timezone || 'UTC';
			const end_ts = args.date_end ?? Math.floor(Date.now() / 1000);
			const start_ts = args.date_start ?? end_ts - 30 * 24 * 3600;
			const interval = args.interval || MintAnalyticsInterval.day;

			const buckets = this.buildTimeBuckets(start_ts, end_ts, interval, timezone);

			const baseline_now_sat = await this.getCurrentOutboundLiquiditySat();

			const events = (
				await Promise.all([
					this.getOutgoingPaymentEvents(start_ts, end_ts),
					this.getIncomingInvoiceEvents(start_ts, end_ts),
					this.getForwardFeeEvents(start_ts, end_ts),
					this.getChannelCloseEvents(start_ts, end_ts),
					this.getChannelOpenEvents(start_ts, end_ts),
				])
			).flat();

			events.sort((a, b) => b.ts - a.ts);

			const series_map = this.reconstructBackward(
				baseline_now_sat,
				events,
				buckets.map((b) => b.ts),
			);

			return buckets.map((b) => new OrchardLightningAnalytics(series_map.get(b.ts) || 0, b.ts));
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.LightningRpcActionError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	private async getCurrentOutboundLiquiditySat(): Promise<number> {
		const list_channels = await this.lightningService.listChannels({active_only: false, inactive_only: false});
		const total_local_sat = (list_channels?.channels || []).reduce((sum: number, c: any) => sum + Number(c.local_balance || 0), 0);
		return total_local_sat;
	}

	private buildTimeBuckets(start_ts: number, end_ts: number, interval: MintAnalyticsInterval, timezone: string) {
		const buckets: {ts: number}[] = [];
		let cursor = DateTime.fromSeconds(end_ts, {zone: 'UTC'});
		const start_dt = DateTime.fromSeconds(start_ts, {zone: 'UTC'});

		const align = (dt: DateTime) => {
			const zoned = dt.setZone(timezone);
			if (interval === 'day') return zoned.startOf('day');
			if (interval === 'week') return zoned.startOf('week');
			return zoned.startOf('month');
		};

		// start from end aligned boundary and walk backward
		let aligned = align(cursor).setZone('UTC');
		if (aligned.toSeconds() < end_ts) aligned = aligned.plus({[interval]: 1});

		while (aligned.toSeconds() >= start_dt.toSeconds()) {
			buckets.push({ts: Math.floor(aligned.toSeconds())});
			aligned = aligned.minus({[interval]: 1});
		}
		buckets.sort((a, b) => a.ts - b.ts);
		return buckets;
	}

	private reconstructBackward(baseline_now_sat: number, events: {ts: number; delta_sat: number}[], bucket_timestamps: number[]) {
		const result = new Map<number, number>();
		let l_sat = baseline_now_sat;
		const sorted_buckets = [...bucket_timestamps].sort((a, b) => b - a);
		for (const bucket_ts of sorted_buckets) {
			while (events.length && events[0].ts > bucket_ts) {
				l_sat += events.shift()!.delta_sat;
			}
			result.set(bucket_ts, l_sat);
		}
		return result;
	}

	private async getOutgoingPaymentEvents(start_ts: number, end_ts: number) {
		const events: {ts: number; delta_sat: number}[] = [];
		let index_offset = 0;
		const max_payments = 1000;
		while (true) {
			const res = await this.lightningService.listPayments({
				include_incomplete: false,
				index_offset,
				max_payments,
				reversed: true,
			});
			for (const p of res?.payments || []) {
				const settle_time_ns = Number(p.settle_time_ns || 0);
				const ts = Math.floor(settle_time_ns ? settle_time_ns / 1e9 : Number(p.creation_time_ns || 0) / 1e9);
				if (ts < start_ts) return events;
				if (ts > end_ts) continue;
				const amount_sat = Number(p.value_sat || 0);
				const fee_sat = Number(p.fee_sat || 0);
				events.push({ts, delta_sat: amount_sat + fee_sat}); // backward add
			}
			if (!res || !res.first_index_offset || res.payments?.length < max_payments) break;
			index_offset = Number(res.first_index_offset);
		}
		return events;
	}

	private async getIncomingInvoiceEvents(start_ts: number, end_ts: number) {
		const events: {ts: number; delta_sat: number}[] = [];
		let index_offset = 0;
		const num_max_invoices = 1000;
		while (true) {
			const res = await this.lightningService.listInvoices({
				pending_only: false,
				index_offset,
				num_max_invoices,
				reversed: true,
			});
			for (const inv of res?.invoices || []) {
				if (!inv.settled) continue;
				const settle_time = Number(inv.settle_time || inv.settle_date || 0); // seconds
				const ts = settle_time || Math.floor(Number(inv.creation_date || 0));
				if (ts < start_ts) return events;
				if (ts > end_ts) continue;
				const amt_paid_sat = Number(inv.amt_paid_sat || 0);
				events.push({ts, delta_sat: -amt_paid_sat}); // backward subtract
			}
			if (!res || !res.first_index_offset || res.invoices?.length < num_max_invoices) break;
			index_offset = Number(res.first_index_offset);
		}
		return events;
	}

	private async getForwardFeeEvents(start_ts: number, end_ts: number) {
		const events: {ts: number; delta_sat: number}[] = [];
		let index_offset = 0;
		const num_max_events = 1000;
		while (true) {
			const res = await this.lightningService.forwardingHistory({
				start_time: start_ts,
				end_time: end_ts,
				index_offset,
				num_max_events,
			});
			for (const f of res?.forwarding_events || []) {
				const ts = Number(f.timestamp);
				const fee_msat = Number(f.fee_msat || 0);
				events.push({ts, delta_sat: -Math.floor(fee_msat / 1000)}); // backward subtract earned fees
			}
			if (!res || !res.last_offset_index || res.forwarding_events?.length < num_max_events) break;
			index_offset = Number(res.last_offset_index);
		}
		return events;
	}

	private async getChannelCloseEvents(start_ts: number, end_ts: number) {
		const events: {ts: number; delta_sat: number}[] = [];
		const res = await this.lightningService.closedChannels({abandoned: false});
		for (const ch of res?.channels || []) {
			const settled_balance = Number(ch.settled_balance || 0);
			// Estimate close timestamp via closing tx time if available, else skip
			const closing_txid = ch.closing_tx_hash || ch.closing_txid || ch.close_txid;
			if (!closing_txid) continue;
			const txs = await this.lightningService.getTransactions({start_height: 0, end_height: 0});
			const tx = (txs?.transactions || []).find((t: any) => t.tx_hash === closing_txid || t.tx_hash === closing_txid?.toLowerCase());
			const ts = tx ? Number(tx.time_stamp) : 0;
			if (!ts) continue;
			if (ts < start_ts || ts > end_ts) continue;
			events.push({ts, delta_sat: settled_balance}); // backward add
		}
		return events;
	}

	private async getChannelOpenEvents(start_ts: number, end_ts: number) {
		const events: {ts: number; delta_sat: number}[] = [];
		const list = await this.lightningService.listChannels({active_only: false, inactive_only: false});
		for (const ch of list?.channels || []) {
			const capacity = Number(ch.capacity || 0);
			const initiator_is_local = !!ch.initiator;
			const push_sat = Number(ch.push_amount_sat || 0);
			// Approx initial local
			const estimated_initial_local = initiator_is_local ? Math.max(0, capacity - push_sat - 0) : 0;
			const lifetime = Number(ch.lifetime || 0); // seconds
			const open_ts = Math.max(0, Math.floor(Date.now() / 1000) - lifetime);
			if (open_ts >= start_ts && open_ts <= end_ts) {
				events.push({ts: open_ts, delta_sat: -estimated_initial_local}); // backward subtract
			}
		}
		return events;
	}
}
