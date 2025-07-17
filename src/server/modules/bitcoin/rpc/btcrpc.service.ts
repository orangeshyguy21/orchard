/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {BitcoinType} from '@server/modules/bitcoin/bitcoin.enums';
import {CoreService} from '@server/modules/bitcoin/core/core.service';
/* Local Dependencies */
import {
	BitcoinBlockchainInfo,
	BitcoinNetworkInfo,
	BitcoinBlock,
	BitcoinTransaction,
	BitcoinFeeEstimate,
	BitcoinBlockTemplate,
} from './btcrpc.types';

@Injectable()
export class BitcoinRpcService implements OnModuleInit {
	private readonly logger = new Logger(BitcoinRpcService.name);

	private type: BitcoinType;

	constructor(
		private configService: ConfigService,
		private coreService: CoreService,
	) {}

	public async onModuleInit() {
		this.type = this.configService.get('bitcoin.type');
		this.initializeRpc();
	}

	private initializeRpc() {
		if (this.type === BitcoinType.CORE) this.coreService.initializeRpc();
	}

	/* *******************************************************
	   Blockchain                      
	******************************************************** */

	public async getBitcoinBlockCount(): Promise<number> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('getblockcount', []);
	}

	public async getBitcoinBlockchainInfo(): Promise<BitcoinBlockchainInfo> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('getblockchaininfo', []);
	}

	public async getBitcoinBlock(hash: string): Promise<BitcoinBlock> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('getblock', [hash, 2]);
	}

	/* *******************************************************
	   Network                      
	******************************************************** */

	public async getBitcoinNetworkInfo(): Promise<BitcoinNetworkInfo> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('getnetworkinfo', []);
	}

	/* *******************************************************
	   Mempool                      
	******************************************************** */

	public async getBitcoinMempool(): Promise<Record<string, BitcoinTransaction>> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('getrawmempool', [true]);
	}

	/* *******************************************************
	   Mining                      
	******************************************************** */

	public async getBitcoinBlockTemplate(): Promise<BitcoinBlockTemplate> {
		if (this.type === BitcoinType.CORE)
			return this.coreService.makeRpcRequest('getblocktemplate', [
				{
					rules: ['segwit'],
					mode: 'template',
				},
			]);
	}

	/* *******************************************************
	   Utilities                      
	******************************************************** */

	public async getBitcoinFeeEstimate(target: number): Promise<BitcoinFeeEstimate> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('estimatesmartfee', [target]);
	}
}
