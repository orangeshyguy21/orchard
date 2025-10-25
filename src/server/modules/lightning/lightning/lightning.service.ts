/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {LightningType} from '@server/modules/lightning/lightning.enums';
import {LndService} from '@server/modules/lightning/lnd/lnd.service';
import {ClnService} from '@server/modules/lightning/cln/cln.service';
import {LnbitsService} from '@server/modules/lightning/lnbits/lnbits.service';
/* Local Dependencies */
import {LightningInfo, LightningChannelBalance, LightningRequest} from './lightning.types';

@Injectable()
export class LightningService implements OnModuleInit {
	private readonly logger = new Logger(LightningService.name);

	private grpc_client: any = null;
	private http_client: any = null;
	private type: LightningType;

	constructor(
		private configService: ConfigService,
		private lndService: LndService,
		private clnService: ClnService,
		private lnbitsService: LnbitsService,
	) {}

	public async onModuleInit() {
		this.type = this.configService.get('lightning.type');
		this.initializeClients();
	}

	private initializeClients() {
		if (this.type === 'lnd') this.grpc_client = this.lndService.initializeLightningClient();
		if (this.type === 'cln') this.grpc_client = this.clnService.initializeLightningClient();
		if (this.type === 'lnbits') this.http_client = this.lnbitsService.initializeLightningClient();
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
		if (this.type === 'lnbits') return this.lnbitsService.mapLnbitsInfo(await this.lnbitsService.getLnbitsInfo());
	}

	async getLightningChannelBalance(): Promise<LightningChannelBalance> {
		if (this.type === 'lnd') return this.makeGrpcRequest('ChannelBalance', {});
		if (this.type === 'cln') {
			return this.clnService.mapClnChannelBalance(
				await this.makeGrpcRequest('ListFunds', {}),
				await this.makeGrpcRequest('ListPeerChannels', {}),
			);
		}
		if (this.type === 'lnbits') return this.lnbitsService.mapLnbitsChannelBalance(await this.lnbitsService.getLnbitsBalance());
	}

	async getLightningRequest(request: string): Promise<LightningRequest> {
		if (this.type === 'lnd') return this.lndService.mapLndRequest(await this.makeGrpcRequest('DecodePayReq', {pay_req: request}));
		if (this.type === 'cln') return this.clnService.mapClnRequest(await this.makeGrpcRequest('Decode', {string: request}));
		if (this.type === 'lnbits') return this.lnbitsService.mapLnbitsRequest(await this.lnbitsService.decodeLnbitsInvoice(request));
	}
}
