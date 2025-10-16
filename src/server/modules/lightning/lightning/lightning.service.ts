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
	ListPaymentsRequest,
	LightningPayments,
	ListInvoicesRequest,
	LightningInvoices,
	ForwardingHistoryRequest,
	LightningForwardingHistory,
	ClosedChannelsRequest,
	LightningClosedChannels,
	GetTransactionsRequest,
	LightningTransactionDetails,
	ListChannelsRequest,
	LightningChannels,
} from './lightning.types';

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

	public async listPayments(request: ListPaymentsRequest): Promise<LightningPayments> {
		if (this.type === 'lnd') return this.makeGrpcRequest('ListPayments', request);
		if (this.type === 'cln') throw OrchardErrorCode.LightningSupportError;
	}

	public async listInvoices(request: ListInvoicesRequest): Promise<LightningInvoices> {
		if (this.type === 'lnd') return this.makeGrpcRequest('ListInvoices', request);
		if (this.type === 'cln') throw OrchardErrorCode.LightningSupportError;
	}

	public async forwardingHistory(request: ForwardingHistoryRequest): Promise<LightningForwardingHistory> {
		if (this.type === 'lnd') return this.makeGrpcRequest('ForwardingHistory', request);
		if (this.type === 'cln') throw OrchardErrorCode.LightningSupportError;
	}

	public async closedChannels(request: ClosedChannelsRequest): Promise<LightningClosedChannels> {
		if (this.type === 'lnd') return this.makeGrpcRequest('ClosedChannels', request);
		if (this.type === 'cln') throw OrchardErrorCode.LightningSupportError;
	}

	public async getTransactions(request: GetTransactionsRequest): Promise<LightningTransactionDetails> {
		if (this.type === 'lnd') return this.makeGrpcRequest('GetTransactions', request);
		if (this.type === 'cln') throw OrchardErrorCode.LightningSupportError;
	}

	public async listChannels(request: ListChannelsRequest): Promise<LightningChannels> {
		if (this.type === 'lnd') return this.makeGrpcRequest('ListChannels', request);
		if (this.type === 'cln') throw OrchardErrorCode.LightningSupportError;
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
}
