/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Vendor Dependencies */
import {EventEmitter} from 'events';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {BitcoinUTXOracleService} from '@server/modules/bitcoin/utxoracle/utxoracle.service';
import {BitcoinRpcService} from '@server/modules/bitcoin/rpc/btcrpc.service';
/* Local Dependencies */
import {OrchardBitcoinOracleBackfillStream, OrchardBitcoinOracleBackfillProgress, OrchardBitcoinOraclePrice} from './btcoracle.model';

@Injectable()
export class BitcoinOracleService {
	private readonly logger = new Logger(BitcoinOracleService.name);
	private event_emitter = new EventEmitter();
	private active_streams: Map<string, AbortController> = new Map();

	constructor(
		private errorService: ErrorService,
		private bitcoinUTXOracleService: BitcoinUTXOracleService,
		private bitcoinRpcService: BitcoinRpcService,
	) {}

	public async getOracle(tag: string, start_timestamp: number, end_timestamp?: number): Promise<OrchardBitcoinOraclePrice[]> {
		try {
			if (end_timestamp) {
				const prices = await this.bitcoinUTXOracleService.getOraclePriceRange(start_timestamp, end_timestamp);
				return prices.map((price) => new OrchardBitcoinOraclePrice(price));
			} else {
				const price = await this.bitcoinUTXOracleService.getOraclePrice(start_timestamp);
				return price ? [new OrchardBitcoinOraclePrice(price)] : [];
			}
		} catch (error) {
			const error_code = this.errorService.resolveError(this.logger, error, tag, {
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}

	/**
	 * Stream backfill oracle prices for a date range and save to database
	 */
	public async streamBackfillOracle(tag: string, stream_id: string, start_timestamp: number, end_timestamp: number): Promise<void> {
		try {
			const controller = new AbortController();
			this.active_streams.set(stream_id, controller);
			const signal = controller.signal;

			const validation_error = await this.validateBackfillRequest(start_timestamp, end_timestamp);
			if (validation_error) {
				this.emitUpdate(stream_id, {status: 'error', error: validation_error});
				this.active_streams.delete(stream_id);
				return;
			}

			const start = DateTime.fromSeconds(start_timestamp, {zone: 'utc'}).startOf('day');
			const end = DateTime.fromSeconds(end_timestamp, {zone: 'utc'}).startOf('day');
			const total_days = Math.floor(end.diff(start, 'days').days) + 1;

			this.emitUpdate(stream_id, {
				status: 'started',
				start_timestamp,
				end_timestamp,
				total_days,
				processed: 0,
				successful: 0,
				failed: 0,
			});

			const stats = {processed: 0, successful: 0, failed: 0};
			let current = start;

			while (current <= end) {
				if (signal.aborted) {
					this.logger.log(`Backfill aborted for stream ${stream_id}`);
					this.emitUpdate(stream_id, {
						status: 'aborted',
						start_timestamp,
						end_timestamp,
						total_days,
						...stats,
					});
					this.active_streams.delete(stream_id);
					return;
				}

				await this.processBackfillDay(stream_id, current, total_days, stats);
				current = current.plus({days: 1});
			}

			this.emitUpdate(stream_id, {
				status: 'completed',
				start_timestamp,
				end_timestamp,
				total_days,
				...stats,
			});
			this.active_streams.delete(stream_id);
		} catch (error) {
			this.active_streams.delete(stream_id);
			this.logger.error(`Backfill stream error: ${error.message}`, error.stack);
			this.emitUpdate(stream_id, {status: 'error', error: error.message});
		}
	}

	/**
	 * Abort a running backfill stream
	 */
	public abortBackfillStream(stream_id: string): OrchardBitcoinOracleBackfillStream {
		const controller = this.active_streams.get(stream_id);
		if (!controller) throw new OrchardApiError(OrchardErrorCode.BitcoinRPCError);
		controller.abort();
		this.active_streams.delete(stream_id);
		return {stream_id};
	}

	/**
	 * Register callback for backfill updates
	 */
	public onBackfillUpdate(callback: (update: OrchardBitcoinOracleBackfillProgress) => void): void {
		this.event_emitter.on('oracle.backfill.update', callback);
	}

	/**
	 * Validate backfill request and return error message if invalid
	 */
	private async validateBackfillRequest(start_timestamp: number, end_timestamp: number): Promise<string | null> {
		const blockchain_info = await this.bitcoinRpcService.getBitcoinBlockchainInfo();
		if (blockchain_info.chain !== 'main') return `Oracle only runs on mainnet. Current chain: ${blockchain_info.chain}`;
		const start = DateTime.fromSeconds(start_timestamp, {zone: 'utc'});
		if (!start.isValid) return `Invalid start_timestamp: ${start_timestamp}`;
		const end = DateTime.fromSeconds(end_timestamp, {zone: 'utc'});
		if (!end.isValid) return `Invalid end_timestamp: ${end_timestamp}`;
		if (start > end) return 'start_timestamp must be before or equal to end_timestamp';
		const today = DateTime.utc().startOf('day');
		if (end >= today) return 'end_timestamp must be before today (can only backfill historical data)';
		return null;
	}

	/**
	 * Process a single day in the backfill operation
	 */
	private async processBackfillDay(
		stream_id: string,
		date: DateTime,
		total_days: number,
		stats: {processed: number; successful: number; failed: number},
	): Promise<void> {
		const date_str = date.toFormat('yyyy-MM-dd');
		const date_timestamp = Math.floor(date.toSeconds());

		try {
			this.logger.log(`Backfilling oracle for ${date_str} (timestamp: ${date_timestamp})...`);
			const result = await this.bitcoinUTXOracleService.runOracle({date: date_timestamp, intraday: false});
			await this.bitcoinUTXOracleService.saveOraclePrice(date_timestamp, result.central_price);
			stats.successful++;
			stats.processed++;
			this.emitUpdate(stream_id, {
				status: 'processing',
				date_timestamp,
				price: result.central_price,
				success: true,
				total_days,
				...stats,
			});
			this.logger.log(`Successfully backfilled ${date_str}: price=${result.central_price}`);
		} catch (error) {
			stats.failed++;
			stats.processed++;
			this.logger.error(`Failed to backfill ${date_str}: ${error.message}`);
			this.emitUpdate(stream_id, {
				status: 'processing',
				date_timestamp,
				success: false,
				error: error.message,
				total_days,
				...stats,
			});
		}
	}

	/**
	 * Emit a backfill update event
	 */
	private emitUpdate(stream_id: string, data: Partial<OrchardBitcoinOracleBackfillProgress>): void {
		this.event_emitter.emit('oracle.backfill.update', new OrchardBitcoinOracleBackfillProgress({stream_id, ...data}));
	}
}
