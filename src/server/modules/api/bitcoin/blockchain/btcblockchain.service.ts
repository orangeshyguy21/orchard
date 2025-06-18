/* Core Dependencies */
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
/* Vendor Dependencies */
import { EventEmitter } from 'events';
/* Application Dependencies */
import { BitcoinRpcService } from '@server/modules/bitcoin/rpc/btcrpc.service';
import { ErrorService } from '@server/modules/error/error.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { OrchardApiError } from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import { OrchardBitcoinBlockCount, OrchardBitcoinBlockchainInfo } from './btcblockchain.model';

@Injectable()
export class BitcoinBlockchainService implements OnModuleDestroy {

	private readonly logger = new Logger(BitcoinBlockchainService.name);
	private interval_id: NodeJS.Timeout;
	private event_emitter = new EventEmitter();
	private block_count: number;
	
	constructor(
		private bitcoinRpcService: BitcoinRpcService,
		private errorService: ErrorService,
	) {}
	
	onModuleDestroy() {
		this.stopBlockCountPolling();
	}

	public async getBlockchainInfo(tag: string = 'GET { bitcoin_blockchain_info }'): Promise<OrchardBitcoinBlockchainInfo> {
		try {
			const info = await this.bitcoinRpcService.getBitcoinBlockchainInfo();
			return new OrchardBitcoinBlockchainInfo(info);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}
	
	public async getBlockCount(tag: string = 'GET { bitcoin_blockcount }'): Promise<OrchardBitcoinBlockCount> {
		try {
			const block_count = await this.bitcoinRpcService.getBitcoinBlockCount();
			return new OrchardBitcoinBlockCount(block_count);
		} catch (error) {
			const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
				errord: OrchardErrorCode.BitcoinRPCError,
			});
			throw new OrchardApiError(error_code);
		}
	}
	
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
	
	stopBlockCountPolling(): void {
		if ( !this.interval_id ) return;
		clearInterval(this.interval_id);
		this.interval_id = null;
		this.logger.debug('Block count polling stopped');
	}
	
	onBlockCountUpdate(callback: (block_count: number) => void): void {
		this.event_emitter.on('bitcoin.blockcount.update', callback);
	}
}