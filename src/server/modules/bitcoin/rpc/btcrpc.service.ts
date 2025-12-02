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
	private chain: string; // stores the chain type (main, test, regtest, signet)

	constructor(
		private configService: ConfigService,
		private coreService: CoreService,
	) {}

	public async onModuleInit() {
		this.type = this.configService.get('bitcoin.type');
		this.initializeRpc();
		await this.initializeChain();
	}

	private initializeRpc() {
		if (this.type === BitcoinType.CORE) this.coreService.initializeRpc();
	}

	/**
	 * Fetches and stores the chain type for use in RPC calls that require it
	 * Falls back gracefully if Bitcoin Core is not available during startup
	 */
	private async initializeChain(): Promise<void> {
		try {
			const blockchain_info = await this.getBitcoinBlockchainInfo();
			this.chain = blockchain_info.chain;
			this.logger.log(`Initialized on chain: ${this.chain}`);
		} catch (error) {
			this.logger.warn(`Failed to fetch chain info during init: ${error.message}`);
		}
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

	public async getBitcoinBlockHash(height: number): Promise<string> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('getblockhash', [height]);
	}

	public async getBitcoinBlockHeader(hash: string): Promise<any> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('getblockheader', [hash, true]);
	}

	public async getBitcoinBlockRaw(hash: string): Promise<string> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('getblock', [hash, 0]);
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
		if (this.type === BitcoinType.CORE) {
			if (!this.chain) {
				const blockchain_info = await this.getBitcoinBlockchainInfo();
				this.chain = blockchain_info.chain;
			}
			const rules = ['segwit'];
			if (this.chain === 'signet') rules.push('signet');
			return this.coreService.makeRpcRequest('getblocktemplate', [
				{
					rules,
					mode: 'template',
				},
			]);
		}
	}

	/* *******************************************************
	   Utilities                      
	******************************************************** */

	public async getBitcoinFeeEstimate(target: number): Promise<BitcoinFeeEstimate> {
		if (this.type === BitcoinType.CORE) return this.coreService.makeRpcRequest('estimatesmartfee', [target]);
	}
}
