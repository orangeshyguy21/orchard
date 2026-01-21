/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {LightningType} from '@server/modules/lightning/lightning.enums';
import {LndService} from '@server/modules/lightning/lnd/lnd.service';
import {ClnService} from '@server/modules/lightning/cln/cln.service';
/* Local Dependencies */
import {
	LightningInfo,
	LightningChannelBalance,
	LightningRequest,
	LightningPayment,
	LightningInvoice,
	LightningForward,
	LightningChannel,
	LightningClosedChannel,
	LightningTransaction,
	LightningHistoryArgs,
} from './lightning.types';
import {
	mapLndPayments,
	mapLndInvoices,
	mapLndForwards,
	mapLndChannels,
	mapLndClosedChannels,
	mapLndTransactions,
} from '@server/modules/lightning/lnd/lnd.helpers';
import {
	mapClnPayments,
	mapClnInvoices,
	mapClnForwards,
	mapClnChannels,
	mapClnClosedChannels,
	mapClnTransactions,
} from '@server/modules/lightning/cln/cln.helpers';

@Injectable()
export class LightningService implements OnModuleInit {
	private readonly logger = new Logger(LightningService.name);

	private grpc_client: any = null;
	private type: LightningType;

	constructor(
		private configService: ConfigService,
		private lndService: LndService,
		private clnService: ClnService,
	) {}

	public async onModuleInit() {
		this.type = this.configService.get('lightning.type');
		this.initializeGrpcClients();
	}

	private initializeGrpcClients() {
		if (this.type === 'lnd') this.grpc_client = this.lndService.initializeLightningClient();
		if (this.type === 'cln') this.grpc_client = this.clnService.initializeLightningClient();
	}

	private makeGrpcRequest(method: string, request: any): Promise<any> {
		if (!this.grpc_client) throw OrchardErrorCode.LightningRpcConnectionError;

		return new Promise((resolve, reject) => {
			if (!(method in this.grpc_client)) reject(OrchardErrorCode.LightningSupportError);
			this.grpc_client[method](request, (error: Error | null, response: any) => {
				if (error) this.logger.debug('error', error);
				if (error && error?.message?.includes('14 UNAVAILABLE')) reject(OrchardErrorCode.LightningRpcConnectionError);
				if (error) reject(error);
				resolve(response);
			});
		});
	}

	async getLightningInfo(): Promise<LightningInfo> {
		if (this.type === 'lnd') return this.makeGrpcRequest('GetInfo', {});
		if (this.type === 'cln') return this.clnService.mapClnInfo(await this.makeGrpcRequest('Getinfo', {}));
	}

	async getLightningChannelBalance(): Promise<LightningChannelBalance> {
		if (this.type === 'lnd') return this.makeGrpcRequest('ChannelBalance', {});
		if (this.type === 'cln') {
			return this.clnService.mapClnChannelBalance(
				await this.makeGrpcRequest('ListFunds', {}),
				await this.makeGrpcRequest('ListPeerChannels', {}),
			);
		}
	}

	async getLightningRequest(request: string): Promise<LightningRequest> {
		if (this.type === 'lnd') return this.lndService.mapLndRequest(await this.makeGrpcRequest('DecodePayReq', {pay_req: request}));
		if (this.type === 'cln') return this.clnService.mapClnRequest(await this.makeGrpcRequest('Decode', {string: request}));
	}

	/* ============================================
	   Lightning History Methods
	   Used for analytics and historical data queries
	   ============================================ */

	/**
	 * Gets outgoing payments from the Lightning node
	 * @param args Optional filtering and pagination arguments
	 */
	async getPayments(args?: LightningHistoryArgs): Promise<LightningPayment[]> {
		if (this.type === 'lnd') {
			const request = {
				include_incomplete: true,
				index_offset: args?.index_offset ? String(args.index_offset) : '0',
				max_payments: args?.max_results ? String(args.max_results) : '1000',
				creation_date_start: args?.start_time ? String(args.start_time) : undefined,
				creation_date_end: args?.end_time ? String(args.end_time) : undefined,
			};
			return mapLndPayments(await this.makeGrpcRequest('ListPayments', request));
		}
		if (this.type === 'cln') {
			const request = {
				index: args?.index_offset ? args.index_offset : undefined,
				limit: args?.max_results ? args.max_results : undefined,
			};
			return mapClnPayments(await this.makeGrpcRequest('ListPays', request));
		}
		return [];
	}

	/**
	 * Gets incoming invoices from the Lightning node
	 * @param args Optional filtering and pagination arguments
	 */
	async getInvoices(args?: LightningHistoryArgs): Promise<LightningInvoice[]> {
		if (this.type === 'lnd') {
			const request = {
				index_offset: args?.index_offset ? String(args.index_offset) : '0',
				num_max_invoices: args?.max_results ?? 1000,
				creation_date_start: args?.start_time ? String(args.start_time) : undefined,
				creation_date_end: args?.end_time ? String(args.end_time) : undefined,
			};
			return mapLndInvoices(await this.makeGrpcRequest('ListInvoices', request));
		}
		if (this.type === 'cln') {
			const request = {
				index: args?.index_offset ? args.index_offset : undefined,
				limit: args?.max_results ? args.max_results : undefined,
			};
			return mapClnInvoices(await this.makeGrpcRequest('ListInvoices', request));
		}
		return [];
	}

	/**
	 * Gets forwarding events (routing) from the Lightning node
	 * @param args Optional filtering and pagination arguments
	 */
	async getForwards(args?: LightningHistoryArgs): Promise<LightningForward[]> {
		if (this.type === 'lnd') {
			const request = {
				start_time: args?.start_time,
				end_time: args?.end_time,
				index_offset: args?.index_offset ?? 0,
				num_max_events: args?.max_results ?? 1000,
			};
			return mapLndForwards(await this.makeGrpcRequest('ForwardingHistory', request));
		}
		if (this.type === 'cln') {
			const request = {
				status: 'settled',
				index: args?.index_offset ? args.index_offset : undefined,
				limit: args?.max_results ? args.max_results : undefined,
			};
			return mapClnForwards(await this.makeGrpcRequest('ListForwards', request));
		}
		return [];
	}

	/**
	 * Gets currently open channels from the Lightning node
	 */
	async getChannels(): Promise<LightningChannel[]> {
		if (this.type === 'lnd') {
			return mapLndChannels(await this.makeGrpcRequest('ListChannels', {}));
		}
		if (this.type === 'cln') {
			return mapClnChannels(await this.makeGrpcRequest('ListPeerChannels', {}));
		}
		return [];
	}

	/**
	 * Gets closed channels from the Lightning node
	 */
	async getClosedChannels(): Promise<LightningClosedChannel[]> {
		if (this.type === 'lnd') {
			return mapLndClosedChannels(await this.makeGrpcRequest('ClosedChannels', {}));
		}
		if (this.type === 'cln') {
			return mapClnClosedChannels(await this.makeGrpcRequest('ListClosedChannels', {}));
		}
		return [];
	}

	/**
	 * Gets on-chain transactions from the Lightning node wallet
	 * Used primarily for looking up funding transaction timestamps
	 */
	async getTransactions(): Promise<LightningTransaction[]> {
		if (this.type === 'lnd') {
			return mapLndTransactions(await this.makeGrpcRequest('GetTransactions', {}));
		}
		if (this.type === 'cln') {
			return mapClnTransactions(await this.makeGrpcRequest('ListTransactions', {}));
		}
		return [];
	}

	/**
	 * Determines the node's birthdate by finding the earliest funding transaction
	 * @returns Unix timestamp in seconds of the earliest channel funding, or 0 if none found
	 */
	async getNodeBirthdate(): Promise<number> {
		const [open_channels, closed_channels, transactions] = await Promise.all([
			this.getChannels(),
			this.getClosedChannels(),
			this.getTransactions(),
		]);

		const tx_map = new Map<string, number>();
		for (const tx of transactions) {
			if (tx.tx_hash && tx.time_stamp > 0) {
				tx_map.set(tx.tx_hash, tx.time_stamp);
			}
		}

		let earliest = Number.MAX_SAFE_INTEGER;

		for (const channel of open_channels) {
			const timestamp = tx_map.get(channel.funding_txid);
			if (timestamp && timestamp < earliest) {
				earliest = timestamp;
			}
		}

		for (const channel of closed_channels) {
			const timestamp = tx_map.get(channel.funding_txid);
			if (timestamp && timestamp < earliest) {
				earliest = timestamp;
			}
		}

		return earliest === Number.MAX_SAFE_INTEGER ? 0 : earliest;
	}

	/**
	 * Checks if lightning is configured and available
	 */
	isConfigured(): boolean {
		return this.type != null && this.grpc_client != null;
	}
}
