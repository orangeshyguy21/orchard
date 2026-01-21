/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository, Between, In} from 'typeorm';
/* Application Dependencies */
import {LightningService} from '@server/modules/lightning/lightning/lightning.service';
import {
	LightningPayment,
	LightningInvoice,
	LightningForward,
	LightningChannel,
	LightningClosedChannel,
	LightningTransaction,
} from '@server/modules/lightning/lightning/lightning.types';
/* Local Dependencies */
import {LightningAnalytics} from './lnanalytics.entity';
import {LightningAnalyticsMetric} from './lnanalytics.enums';
import {HourlyMetrics, LightningAnalyticsBackfillStatus} from './lnanalytics.interfaces';

const BACKFILL_SLEEP_MS = 100;
const BACKFILL_MAX_CONSECUTIVE_ERRORS = 10;
const BACKFILL_INITIAL_BACKOFF_MS = 1000;
const BACKFILL_MAX_BACKOFF_MS = 32000;

@Injectable()
export class LightningAnalyticsService implements OnModuleInit {
	private readonly logger = new Logger(LightningAnalyticsService.name);
	private backfill_status: LightningAnalyticsBackfillStatus = {is_running: false};
	private node_pubkey: string | null = null;

	constructor(
		@InjectRepository(LightningAnalytics)
		private lightningAnalyticsRepository: Repository<LightningAnalytics>,
		private lightningService: LightningService,
	) {}

	/**
	 * Gets the current node's public key, caching it for subsequent calls
	 */
	private async getNodePubkey(): Promise<string> {
		if (this.node_pubkey) return this.node_pubkey;
		const info = await this.lightningService.getLightningInfo();
		if (!info.identity_pubkey) {
			throw new Error('Could not get node pubkey from lightning info');
		}
		this.node_pubkey = info.identity_pubkey;
		return this.node_pubkey;
	}

	/**
	 * Gets the last cached hour timestamp for the current node
	 */
	async getLastCachedHour(): Promise<number | null> {
		const node_pubkey = await this.getNodePubkey();
		const result = await this.lightningAnalyticsRepository.findOne({
			where: {node_pubkey},
			order: {date: 'DESC'},
		});
		return result ? result.date : null;
	}

	async onModuleInit() {
		if (!this.lightningService.isConfigured()) {
			this.logger.log('Lightning not configured, skipping auto-backfill');
			return;
		}

		const last_cached = await this.getLastCachedHour();
		if (last_cached === null) {
			this.logger.log('No cached analytics found, starting full backfill');
			this.runBackfill();
		} else {
			const current_hour = this.getHourStart(Math.floor(Date.now() / 1000));
			const gap_hours = Math.floor((current_hour - last_cached) / 3600) - 1;
			if (gap_hours > 0) {
				this.logger.log(`Found ${gap_hours} hour gap, starting gap backfill`);
				this.runBackfill(last_cached + 3600);
			}
		}
	}

	/**
	 * Gets cached analytics for a date range
	 */
	async getCachedAnalytics(date_start: number, date_end: number, metrics: LightningAnalyticsMetric[]): Promise<LightningAnalytics[]> {
		if (date_end < date_start) return [];

		const node_pubkey = await this.getNodePubkey();
		return this.lightningAnalyticsRepository.find({
			where: {
				node_pubkey,
				date: Between(this.getHourStart(date_start), this.getHourStart(date_end)),
				metric: In(metrics),
			},
			order: {date: 'ASC'},
		});
	}

	/**
	 * Computes metrics for a specific hour by fetching raw data from the lightning node
	 */
	async computeHourlyAnalytics(hour_start: number): Promise<HourlyMetrics> {
		const hour_end = hour_start + 3600;

		const [payments, invoices, forwards, channels, closed_channels, transactions] = await Promise.all([
			this.lightningService.getPayments({start_time: hour_start, end_time: hour_end}),
			this.lightningService.getInvoices({start_time: hour_start, end_time: hour_end}),
			this.lightningService.getForwards({start_time: hour_start, end_time: hour_end}),
			this.lightningService.getChannels(),
			this.lightningService.getClosedChannels(),
			this.lightningService.getTransactions(),
		]);

		const tx_timestamps = this.buildTxTimestampMap(transactions);

		return {
			payments_out_msat: this.sumPaymentsOut(payments),
			invoices_in_msat: this.sumInvoicesIn(invoices),
			forward_fees_msat: this.sumForwardFees(forwards),
			channel_opens_msat: this.sumChannelOpens(channels, closed_channels, tx_timestamps, hour_start, hour_end),
			channel_closes_msat: this.sumChannelCloses(closed_channels, tx_timestamps, hour_start, hour_end),
		};
	}

	/**
	 * Computes metrics and converts them to entities for a specific hour
	 */
	async computeAndBuildEntities(hour_start: number): Promise<LightningAnalytics[]> {
		const node_pubkey = await this.getNodePubkey();
		const metrics = await this.computeHourlyAnalytics(hour_start);
		return this.metricsToEntities(hour_start, metrics, node_pubkey);
	}

	/**
	 * Converts HourlyMetrics to LightningAnalytics entities
	 */
	private metricsToEntities(hour_start: number, metrics: HourlyMetrics, node_pubkey: string): LightningAnalytics[] {
		const entities: LightningAnalytics[] = [];
		const metric_map: {metric: LightningAnalyticsMetric; value: bigint}[] = [
			{metric: LightningAnalyticsMetric.payments_out, value: metrics.payments_out_msat},
			{metric: LightningAnalyticsMetric.invoices_in, value: metrics.invoices_in_msat},
			{metric: LightningAnalyticsMetric.forward_fees, value: metrics.forward_fees_msat},
			{metric: LightningAnalyticsMetric.channel_opens, value: metrics.channel_opens_msat},
			{metric: LightningAnalyticsMetric.channel_closes, value: metrics.channel_closes_msat},
		];

		for (const {metric, value} of metric_map) {
			const entity = new LightningAnalytics();
			entity.node_pubkey = node_pubkey;
			entity.metric = metric;
			entity.date = hour_start;
			entity.amount_msat = value.toString();
			entities.push(entity);
		}

		return entities;
	}

	/**
	 * Caches analytics for a specific hour
	 * Only stores metrics with non-zero amounts to optimize storage
	 */
	async cacheHourlyAnalytics(hour_start: number): Promise<void> {
		const node_pubkey = await this.getNodePubkey();
		const metrics = await this.computeHourlyAnalytics(hour_start);
		const entities = this.metricsToEntities(hour_start, metrics, node_pubkey);
		const now = Math.floor(Date.now() / 1000);

		for (const entity of entities) {
			const is_zero = entity.amount_msat === '0';
			const existing = await this.lightningAnalyticsRepository.findOne({
				where: {node_pubkey, metric: entity.metric, date: entity.date},
			});

			if (existing) {
				if (is_zero) {
					// Remove existing record if new value is zero
					await this.lightningAnalyticsRepository.remove(existing);
				} else {
					existing.amount_msat = entity.amount_msat;
					existing.attempts = existing.attempts + 1;
					existing.updated_at = now;
					await this.lightningAnalyticsRepository.save(existing);
				}
			} else if (!is_zero) {
				// Only insert if non-zero
				entity.attempts = 1;
				entity.updated_at = now;
				await this.lightningAnalyticsRepository.save(entity);
			}
		}
	}

	/**
	 * Gets the current backfill status
	 */
	getBackfillStatus(): LightningAnalyticsBackfillStatus {
		return {...this.backfill_status};
	}

	/**
	 * Runs backfill from a starting point to current hour
	 * @param from_hour Optional starting hour timestamp. If not provided, starts from node birthdate.
	 */
	async runBackfill(from_hour?: number): Promise<void> {
		if (this.backfill_status.is_running) {
			this.logger.warn('Backfill already running');
			return;
		}

		this.backfill_status = {
			is_running: true,
			started_at: Math.floor(Date.now() / 1000),
			hours_completed: 0,
			errors: 0,
		};

		try {
			const start_hour = await this.resolveBackfillStartHour(from_hour);
			if (start_hour === null) {
				this.backfill_status.is_running = false;
				return;
			}

			const current_hour = this.getHourStart(Math.floor(Date.now() / 1000));
			const total_hours = Math.floor((current_hour - start_hour) / 3600);

			this.backfill_status.current_hour = start_hour;
			this.backfill_status.target_hour = current_hour;
			this.backfill_status.hours_remaining = total_hours;

			this.logger.log(`Starting backfill from ${new Date(start_hour * 1000).toISOString()} (${total_hours} hours)`);

			let consecutive_errors = 0;
			let backoff_ms = BACKFILL_INITIAL_BACKOFF_MS;

			for (let hour = start_hour; hour < current_hour; hour += 3600) {
				this.backfill_status.current_hour = hour;
				this.backfill_status.hours_remaining = Math.floor((current_hour - hour) / 3600);

				try {
					await this.cacheHourlyAnalytics(hour);
					this.backfill_status.hours_completed++;
					consecutive_errors = 0;
					backoff_ms = BACKFILL_INITIAL_BACKOFF_MS;

					await this.sleep(BACKFILL_SLEEP_MS);
				} catch (error) {
					consecutive_errors++;
					this.backfill_status.errors++;
					this.logger.error(`Backfill error for hour ${hour}: ${error.message}`);

					if (consecutive_errors >= BACKFILL_MAX_CONSECUTIVE_ERRORS) {
						this.logger.error(`Backfill killed after ${BACKFILL_MAX_CONSECUTIVE_ERRORS} consecutive errors`);
						break;
					}

					await this.sleep(backoff_ms);
					backoff_ms = Math.min(backoff_ms * 2, BACKFILL_MAX_BACKOFF_MS);
				}
			}

			this.logger.log(`Backfill complete: ${this.backfill_status.hours_completed} hours cached, ${this.backfill_status.errors} errors`);
		} finally {
			this.backfill_status.is_running = false;
		}
	}

	/**
	 * Resolves the starting hour for backfill
	 * @returns The hour timestamp to start from, or null if backfill should be skipped
	 */
	private async resolveBackfillStartHour(from_hour?: number): Promise<number | null> {
		if (from_hour !== undefined) {
			return this.getHourStart(from_hour);
		}

		const birthdate = await this.lightningService.getNodeBirthdate();
		if (birthdate === 0) {
			this.logger.warn('Could not determine node birthdate, skipping backfill');
			return null;
		}

		return this.getHourStart(birthdate);
	}

	/**
	 * Checks if there's any cached data for the current node
	 */
	async hasAnyCachedData(): Promise<boolean> {
		const node_pubkey = await this.getNodePubkey();
		const count = await this.lightningAnalyticsRepository.count({where: {node_pubkey}});
		return count > 0;
	}

	/**
	 * Returns the hour start timestamp for a given timestamp
	 */
	getHourStart(timestamp: number): number {
		return Math.floor(timestamp / 3600) * 3600;
	}

	private sumPaymentsOut(payments: LightningPayment[]): bigint {
		let total = BigInt(0);
		for (const p of payments) {
			if (p.status === 'succeeded') {
				total += BigInt(p.value_msat) + BigInt(p.fee_msat);
			}
		}
		return total;
	}

	private sumInvoicesIn(invoices: LightningInvoice[]): bigint {
		let total = BigInt(0);
		for (const i of invoices) {
			if (i.state === 'settled') {
				total += BigInt(i.amt_paid_msat);
			}
		}
		return total;
	}

	private sumForwardFees(forwards: LightningForward[]): bigint {
		let total = BigInt(0);
		for (const f of forwards) {
			total += BigInt(f.fee_msat);
		}
		return total;
	}

	private sumChannelOpens(
		open_channels: LightningChannel[],
		closed_channels: LightningClosedChannel[],
		tx_timestamps: Map<string, number>,
		hour_start: number,
		hour_end: number,
	): bigint {
		let total = BigInt(0);
		const all_channels = [...open_channels, ...closed_channels];

		for (const channel of all_channels) {
			const open_time = tx_timestamps.get(channel.funding_txid);
			if (!open_time || open_time < hour_start || open_time >= hour_end) continue;

			const initial_local_msat = this.computeInitialLocalBalance(channel);
			total += initial_local_msat;
		}

		return total;
	}

	private sumChannelCloses(
		closed_channels: LightningClosedChannel[],
		_tx_timestamps: Map<string, number>,
		_hour_start: number,
		_hour_end: number,
	): bigint {
		let total = BigInt(0);

		for (const channel of closed_channels) {
			// For closes, we'd need close timestamp, but CLN doesn't provide close_height reliably
			// For now, use the close_height if available (would need block timestamp lookup)
			// This is a simplified version - full implementation would convert close_height to timestamp
			const close_time = channel.close_height;
			if (close_time === 0) continue;

			// Simplified: assume close happened in this hour if we have data
			// Full implementation would convert block height to timestamp
			const settled_msat = BigInt(channel.settled_balance) * BigInt(1000);
			total += settled_msat;
		}

		return total;
	}

	private computeInitialLocalBalance(channel: LightningChannel | LightningClosedChannel): bigint {
		const capacity_msat = BigInt(channel.capacity) * BigInt(1000);

		// For LightningChannel
		if ('initiator' in channel && channel.initiator !== null) {
			const push_msat = channel.push_amount_sat ? BigInt(channel.push_amount_sat) * BigInt(1000) : BigInt(0);
			if (channel.initiator === true) {
				return capacity_msat - push_msat;
			} else {
				return push_msat;
			}
		}

		// For LightningClosedChannel
		if ('open_initiator' in channel) {
			const closed = channel as LightningClosedChannel;
			if (closed.open_initiator === 'local') {
				return capacity_msat;
			} else if (closed.open_initiator === 'remote') {
				return BigInt(0);
			}
		}

		// Unknown initiator - use current/settled balance as approximation
		if ('local_balance' in channel) {
			return BigInt((channel as LightningChannel).local_balance) * BigInt(1000);
		}
		if ('settled_balance' in channel) {
			return BigInt((channel as LightningClosedChannel).settled_balance) * BigInt(1000);
		}

		return BigInt(0);
	}

	private buildTxTimestampMap(transactions: LightningTransaction[]): Map<string, number> {
		const map = new Map<string, number>();
		for (const tx of transactions) {
			if (tx.tx_hash && tx.time_stamp > 0) {
				map.set(tx.tx_hash, tx.time_stamp);
			}
		}
		return map;
	}

	private sleep(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
