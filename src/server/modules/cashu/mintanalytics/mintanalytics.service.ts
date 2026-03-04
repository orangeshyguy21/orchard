/* Core Dependencies */
import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {InjectRepository} from '@nestjs/typeorm';
/* Vendor Dependencies */
import {Repository, FindOptionsWhere, Between, In} from 'typeorm';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintApiService} from '@server/modules/cashu/mintapi/cashumintapi.service';
import {AnalyticsCheckpoint} from '@server/modules/analytics/analytics-checkpoint.entity';
import {
	CashuMintDatabase,
	CashuMintMintQuote,
	CashuMintMeltQuote,
	CashuMintSwap,
	CashuMintProof,
	CashuMintPromise,
} from '@server/modules/cashu/mintdb/cashumintdb.types';
import {MintQuoteState, MeltQuoteState, MintProofState} from '@server/modules/cashu/cashu.enums';
/* Native Dependencies */
import {MintAnalytics} from './mintanalytics.entity';
import {MintAnalyticsMetric} from './mintanalytics.enums';
import {MintAnalyticsBackfillStatus, MintAnalyticsCachedArgs} from './mintanalytics.interfaces';

const BATCH_SIZE = 100;
const MAX_PENDING_RECORDS = 100_000;
const FORCE_FLUSH_COUNT = 10;
const RESCAN_PAGES = 20;

type CheckpointDataType = 'mint_quotes' | 'melt_quotes' | 'swaps' | 'proofs' | 'promises';
const CHECKPOINT_DATA_TYPES: CheckpointDataType[] = ['mint_quotes', 'melt_quotes', 'swaps', 'proofs', 'promises'];

@Injectable()
export class CashuMintAnalyticsService implements OnApplicationBootstrap {
	private readonly logger = new Logger(CashuMintAnalyticsService.name);
	private backfill_status: MintAnalyticsBackfillStatus = {is_running: false};
	private mint_pubkey: string | null = null;

	constructor(
		@InjectRepository(MintAnalytics)
		private mintAnalyticsRepository: Repository<MintAnalytics>,
		@InjectRepository(AnalyticsCheckpoint)
		private checkpointRepository: Repository<AnalyticsCheckpoint>,
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private cashuMintApiService: CashuMintApiService,
		private configService: ConfigService,
	) {}

	async onApplicationBootstrap() {
		const cashu_type = this.configService.get<string>('cashu.type');
		if (!cashu_type) {
			this.logger.log('Cashu not configured, skipping auto-backfill');
			return;
		}

		this.runBackfill().catch((error) => {
			this.logger.error('Error during cashu mint analytics auto-backfill', error);
		});
	}

	/* *******************************************************
		Public API
	******************************************************** */

	/** Returns the current backfill status */
	getBackfillStatus(): MintAnalyticsBackfillStatus {
		return {...this.backfill_status};
	}

	/** Gets cached analytics for a date range */
	async getCachedAnalytics(args: MintAnalyticsCachedArgs): Promise<MintAnalytics[]> {
		const mint_pubkey = await this.getMintPubkey();
		const where: FindOptionsWhere<MintAnalytics> = {mint_pubkey};

		if (args.date_start !== undefined && args.date_end !== undefined) {
			const start_hour = DateTime.fromSeconds(args.date_start, {zone: 'UTC'}).startOf('hour').toSeconds();
			const end_hour = DateTime.fromSeconds(args.date_end, {zone: 'UTC'}).startOf('hour').toSeconds();
			where.date = Between(start_hour, end_hour);
		}

		if (args.metrics?.length) {
			where.metric = In(args.metrics);
		}

		if (args.units?.length) {
			where.unit = In(args.units);
		}

		return this.mintAnalyticsRepository.find({where, order: {date: 'ASC'}});
	}

	/** Runs the streaming backfill - opens ONE external DB connection, runs 5 streams, closes */
	async runBackfill(): Promise<void> {
		if (this.backfill_status.is_running) {
			this.logger.warn('Backfill already running');
			return;
		}

		let client: CashuMintDatabase;
		try {
			client = await this.cashuMintDatabaseService.getMintDatabase();
			if (client.type === 'postgres') await client.database.connect();
		} catch (error) {
			this.logger.error('Failed to connect to mint database for backfill', error);
			return;
		}

		this.backfill_status = {is_running: true, started_at: DateTime.utc().toSeconds(), hours_completed: 0, errors: 0};
		this.logger.log('Starting cashu mint analytics backfill');

		try {
			const current_hour = DateTime.utc().startOf('hour').toSeconds();

			await this.streamAndBucket<CashuMintMintQuote>(
				current_hour,
				'mint_quotes',
				(opts) => this.cashuMintDatabaseService.listMintQuotes(client, opts),
				(h, records) => this.insertMintQuoteMetrics(h, records),
			);
			await this.streamAndBucket<CashuMintMeltQuote>(
				current_hour,
				'melt_quotes',
				(opts) => this.cashuMintDatabaseService.listMeltQuotes(client, opts),
				(h, records) => this.insertMeltQuoteMetrics(h, records),
			);
			await this.streamAndBucket<CashuMintSwap>(
				current_hour,
				'swaps',
				(opts) => this.cashuMintDatabaseService.listSwaps(client, opts),
				(h, records) => this.insertSwapMetrics(h, records),
			);
			await this.streamAndBucket<CashuMintProof>(
				current_hour,
				'proofs',
				(opts) =>
					this.cashuMintDatabaseService.listProofs(client, {
						...opts,
						states: [MintProofState.SPENT],
					}),
				(h, records) => this.insertProofMetrics(h, records),
			);
			await this.streamAndBucket<CashuMintPromise>(
				current_hour,
				'promises',
				(opts) => this.cashuMintDatabaseService.listPromises(client, opts),
				(h, records) => this.insertPromiseMetrics(h, records),
			);

			this.logger.log(`Cashu mint analytics backfill complete: ${this.backfill_status.hours_completed} hours cached`);
		} catch (error) {
			this.logger.error('Cashu mint analytics backfill error', error);
			this.backfill_status.errors++;
		} finally {
			if (client.type === 'sqlite') client.database.close();
			if (client.type === 'postgres') client.database.end();
			this.backfill_status.is_running = false;
		}
	}

	/** Re-scans recent records to catch state changes (UNPAID → PAID → ISSUED) */
	async rescanRecentRecords(): Promise<void> {
		if (this.backfill_status.is_running) {
			this.logger.warn('Backfill already running, skipping rescan');
			return;
		}

		this.logger.log('Resetting checkpoints to re-scan recent pages');
		for (const data_type of CHECKPOINT_DATA_TYPES) {
			const checkpoint = await this.getCheckpoint(data_type);
			await this.saveCheckpoint(data_type, Math.max(1, checkpoint - RESCAN_PAGES));
		}

		await this.runBackfill();
	}

	/* *******************************************************
		Stream Methods
	******************************************************** */

	/** Generic stream-and-bucket: fetches pages, buckets by hour, flushes metrics */
	private async streamAndBucket<T extends {created_time: number}>(
		current_hour: number,
		data_type: CheckpointDataType,
		fetcher: (opts: {page: number; page_size: number}) => Promise<T[]>,
		inserter: (hour: number, records: T[]) => Promise<void>,
	): Promise<void> {
		let page = await this.getCheckpoint(data_type);
		if (page < 1) page = 1;
		const pending_bucket: Map<number, T[]> = new Map();

		while (true) {
			const batch = await fetcher({page, page_size: BATCH_SIZE});
			if (batch.length === 0) break;

			for (const record of batch) {
				const hour = DateTime.fromSeconds(record.created_time, {zone: 'UTC'}).startOf('hour').toSeconds();
				if (hour >= current_hour) continue;
				if (!pending_bucket.has(hour)) pending_bucket.set(hour, []);
				pending_bucket.get(hour)!.push(record);
			}

			page++;
			await this.saveCheckpoint(data_type, page);
			if (batch.length < BATCH_SIZE) break;
			await this.forceFlushIfNeeded(pending_bucket, inserter);
		}

		await this.flushBuckets(pending_bucket, inserter);
	}

	/* *******************************************************
		Metric Insertion
	******************************************************** */

	/** Inserts mint quote metrics for a specific hour */
	private async insertMintQuoteMetrics(hour: number, quotes: CashuMintMintQuote[]): Promise<void> {
		const mint_pubkey = await this.getMintPubkey();
		const by_unit = this.groupByUnit(quotes, (q) => q.unit);

		for (const [unit, unit_quotes] of by_unit) {
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.mints_created,
				hour,
				amount: BigInt(0),
				count: unit_quotes.length,
			});

			const issued = unit_quotes.filter((q) => q.state === MintQuoteState.ISSUED);
			const mints_amount = issued.reduce((sum, q) => sum + BigInt(q.amount_issued), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.mints_amount,
				hour,
				amount: mints_amount,
				count: issued.length,
			});

			const with_timing = issued.filter((q) => q.issued_time !== null && q.issued_time !== undefined);
			const total_completion = with_timing.reduce((sum, q) => sum + BigInt(Math.max(0, q.issued_time! - q.created_time)), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.mints_completion_time,
				hour,
				amount: total_completion,
				count: with_timing.length,
			});
		}
	}

	/** Inserts melt quote metrics for a specific hour */
	private async insertMeltQuoteMetrics(hour: number, quotes: CashuMintMeltQuote[]): Promise<void> {
		const mint_pubkey = await this.getMintPubkey();
		const by_unit = this.groupByUnit(quotes, (q) => q.unit);

		for (const [unit, unit_quotes] of by_unit) {
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.melts_created,
				hour,
				amount: BigInt(0),
				count: unit_quotes.length,
			});

			const paid = unit_quotes.filter((q) => q.state === MeltQuoteState.PAID);
			const melts_amount = paid.reduce((sum, q) => sum + BigInt(q.amount), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.melts_amount,
				hour,
				amount: melts_amount,
				count: paid.length,
			});

			const with_timing = paid.filter((q) => q.paid_time !== null && q.paid_time !== undefined);
			const total_completion = with_timing.reduce((sum, q) => sum + BigInt(Math.max(0, q.paid_time! - q.created_time)), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.melts_completion_time,
				hour,
				amount: total_completion,
				count: with_timing.length,
			});
		}
	}

	/** Inserts swap metrics for a specific hour */
	private async insertSwapMetrics(hour: number, swaps: CashuMintSwap[]): Promise<void> {
		const mint_pubkey = await this.getMintPubkey();
		const by_unit = this.groupByUnit(swaps, (s) => s.unit);

		for (const [unit, unit_swaps] of by_unit) {
			const swaps_amount = unit_swaps.reduce((sum, s) => sum + BigInt(s.amount), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.swaps_amount,
				hour,
				amount: swaps_amount,
				count: unit_swaps.length,
			});

			const swaps_fee = unit_swaps.reduce((sum, s) => sum + BigInt(s.fee || 0), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.swaps_fee,
				hour,
				amount: swaps_fee,
				count: unit_swaps.length,
			});

			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.fees_amount,
				hour,
				amount: swaps_fee,
				count: unit_swaps.length,
			});
		}
	}

	/** Inserts proof metrics (redeemed) for a specific hour */
	private async insertProofMetrics(hour: number, proofs: CashuMintProof[]): Promise<void> {
		const mint_pubkey = await this.getMintPubkey();

		const by_unit = this.groupByUnit(proofs, (p) => p.unit);
		for (const [unit, unit_proofs] of by_unit) {
			const redeemed_amount = unit_proofs.reduce((sum, p) => sum + BigInt(p.amount), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.redeemed_amount,
				hour,
				amount: redeemed_amount,
				count: unit_proofs.length,
			});
		}

		const by_keyset = this.groupByKeysetAndUnit(
			proofs,
			(p) => p.keyset_id,
			(p) => p.unit,
		);
		for (const [key, keyset_proofs] of by_keyset) {
			const [keyset_id, unit] = key.split('|');
			const amount = keyset_proofs.reduce((sum, p) => sum + BigInt(p.amount), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id,
				unit,
				metric: MintAnalyticsMetric.keyset_redeemed,
				hour,
				amount,
				count: keyset_proofs.length,
			});
		}
	}

	/** Inserts promise metrics (issued) for a specific hour */
	private async insertPromiseMetrics(hour: number, promises: CashuMintPromise[]): Promise<void> {
		const mint_pubkey = await this.getMintPubkey();

		const by_unit = this.groupByUnit(promises, (p) => p.unit);
		for (const [unit, unit_promises] of by_unit) {
			const issued_amount = unit_promises.reduce((sum, p) => sum + BigInt(p.amount), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id: '',
				unit,
				metric: MintAnalyticsMetric.issued_amount,
				hour,
				amount: issued_amount,
				count: unit_promises.length,
			});
		}

		const by_keyset = this.groupByKeysetAndUnit(
			promises,
			(p) => p.keyset_id,
			(p) => p.unit,
		);
		for (const [key, keyset_promises] of by_keyset) {
			const [keyset_id, unit] = key.split('|');
			const amount = keyset_promises.reduce((sum, p) => sum + BigInt(p.amount), BigInt(0));
			await this.upsertMetric({
				mint_pubkey,
				keyset_id,
				unit,
				metric: MintAnalyticsMetric.keyset_issued,
				hour,
				amount,
				count: keyset_promises.length,
			});
		}
	}

	/* *******************************************************
		Checkpoint Methods
	******************************************************** */

	/** Gets the checkpoint for a specific data type */
	async getCheckpoint(data_type: CheckpointDataType): Promise<number> {
		const mint_pubkey = await this.getMintPubkey();
		const result = await this.checkpointRepository.findOne({
			where: {module: 'cashu_mint', scope: mint_pubkey, data_type},
		});
		return result?.last_index ?? 0;
	}

	/** Saves the checkpoint for a specific data type */
	private async saveCheckpoint(data_type: CheckpointDataType, index: number): Promise<void> {
		const mint_pubkey = await this.getMintPubkey();
		await this.checkpointRepository.upsert(
			{
				module: 'cashu_mint',
				scope: mint_pubkey,
				data_type,
				last_index: index,
				updated_at: Math.floor(DateTime.utc().toSeconds()),
			},
			['module', 'scope', 'data_type'],
		);
	}

	/* *******************************************************
		Helpers
	******************************************************** */

	/** Gets the mint pubkey from config, falling back to mint API */
	private async getMintPubkey(): Promise<string> {
		if (this.mint_pubkey) return this.mint_pubkey;
		const info = await this.cashuMintApiService.getMintInfo();
		if (!info.pubkey) {
			throw new Error('Could not get mint pubkey from mint info');
		}
		this.mint_pubkey = info.pubkey;
		return this.mint_pubkey;
	}

	/** Upserts an analytics metric row */
	private async upsertMetric(params: {
		mint_pubkey: string;
		keyset_id: string;
		unit: string;
		metric: MintAnalyticsMetric;
		hour: number;
		amount: bigint;
		count: number;
	}): Promise<void> {
		if (params.amount <= BigInt(0) && params.count <= 0) return;

		await this.mintAnalyticsRepository.upsert(
			{
				mint_pubkey: params.mint_pubkey,
				keyset_id: params.keyset_id,
				unit: params.unit,
				metric: params.metric,
				date: params.hour,
				amount: params.amount.toString(),
				count: params.count,
				updated_at: Math.floor(DateTime.utc().toSeconds()),
			},
			{conflictPaths: ['mint_pubkey', 'keyset_id', 'unit', 'metric', 'date']},
		);
	}

	/** Groups items by unit string */
	private groupByUnit<T>(items: T[], getUnit: (item: T) => string): [string, T[]][] {
		const map: Record<string, T[]> = {};
		for (const item of items) {
			const unit = getUnit(item) || 'sat';
			if (!map[unit]) map[unit] = [];
			map[unit].push(item);
		}
		return Object.entries(map);
	}

	/** Groups items by composite keyset_id|unit key */
	private groupByKeysetAndUnit<T>(items: T[], getKeyset: (item: T) => string, getUnit: (item: T) => string): [string, T[]][] {
		const map: Record<string, T[]> = {};
		for (const item of items) {
			const key = `${getKeyset(item)}|${getUnit(item) || 'sat'}`;
			if (!map[key]) map[key] = [];
			map[key].push(item);
		}
		return Object.entries(map);
	}

	/** Flushes all remaining buckets */
	private async flushBuckets<T>(bucket: Map<number, T[]>, inserter: (hour: number, records: T[]) => Promise<void>): Promise<void> {
		for (const [hour, records] of Array.from(bucket).sort(([a], [b]) => a - b)) {
			await inserter(hour, records);
			this.backfill_status.hours_completed++;
		}
		bucket.clear();
	}

	/** Force-flushes oldest hours when memory limit is exceeded */
	private async forceFlushIfNeeded<T>(bucket: Map<number, T[]>, inserter: (hour: number, records: T[]) => Promise<void>): Promise<void> {
		const total_pending = Array.from(bucket.values()).reduce((sum, arr) => sum + arr.length, 0);
		if (total_pending <= MAX_PENDING_RECORDS) return;

		this.logger.warn(`Pending bucket exceeded ${MAX_PENDING_RECORDS}, force-flushing oldest hours`);
		const oldest_hours = Array.from(bucket.keys())
			.sort((a, b) => a - b)
			.slice(0, FORCE_FLUSH_COUNT);
		for (const hour of oldest_hours) {
			await inserter(hour, bucket.get(hour)!);
			bucket.delete(hour);
			this.backfill_status.hours_completed++;
		}
	}
}
