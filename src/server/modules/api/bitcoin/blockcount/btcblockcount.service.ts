/* Core Dependencies */
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
/* Vendor Dependencies */
import { EventEmitter } from 'events';
/* Application Dependencies */
import { BitcoinService } from '@server/modules/bitcoin/bitcoin.service';
import { ErrorService } from '@server/modules/error/error.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import { OrchardBitcoinBlockCount } from './btcblockcount.model';

@Injectable()
export class BitcoinBlockCountService implements OnModuleDestroy {

	private readonly logger = new Logger(BitcoinBlockCountService.name);
	private interval_id: NodeJS.Timeout;
	private event_emitter = new EventEmitter();
	private block_count: number;
	
	constructor(
		private bitcoinService: BitcoinService,
		private errorService: ErrorService,
	) {}
	
	onModuleDestroy() {
		this.stopBlockCountPolling();
	}
	
	// Method to get the current block count
	async getBlockCount(): Promise<OrchardBitcoinBlockCount> {
		try {
			const block_count = await this.bitcoinService.getBlockCount();
			return new OrchardBitcoinBlockCount(block_count);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error,
				errord: OrchardErrorCode.BitcoinRPCError,
				msg: 'Error getting block count',
			});
			throw new OrchardApiError(error_code);
		}
	}
	
	// Start polling for block count updates
	startBlockCountPolling(interval_ms: number = 30000): void {
		if (this.interval_id) this.stopBlockCountPolling();
		
		this.interval_id = setInterval(async () => {
			try {
				const obbc = await this.getBlockCount();
				if( obbc.height === this.block_count ) return;
				this.block_count = obbc.height;
				this.event_emitter.emit('bitcoin.blockcount.update', obbc.height);
			} catch (error) {
				this.stopBlockCountPolling();
				throw error;
			}
		}, interval_ms);
		
		this.logger.debug('Block count polling started');
	}
	
	// Stop polling for block count updates
	stopBlockCountPolling(): void {
		if ( !this.interval_id ) return;
		clearInterval(this.interval_id);
		this.interval_id = null;
		this.logger.debug('Block count polling stopped');
	}
	
	// Register a callback for block count updates
	onBlockCountUpdate(callback: (block_count: number) => void): void {
		this.event_emitter.on('bitcoin.blockcount.update', callback);
	}
}