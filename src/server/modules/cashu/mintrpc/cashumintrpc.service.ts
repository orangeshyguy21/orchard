/* Core Dependencies */
import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
/* Vendor Dependencies */
import {ServiceError, status} from '@grpc/grpc-js';
/* Application Dependencies */
import {CdkService} from '@server/modules/cashu/cdk/cdk.service';
import {NutshellService} from '@server/modules/cashu/nutshell/nutshell.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {MintType} from '@server/modules/cashu/cashu.enums';
/* Local Dependencies */
import {CashuMintInfoRpc} from './cashumintrpc.types';

@Injectable()
export class CashuMintRpcService implements OnModuleInit {
	private readonly logger = new Logger(CashuMintRpcService.name);
	private grpc_client: any = null;
	private type: MintType;

	constructor(
		private configService: ConfigService,
		private cdkService: CdkService,
		private nutshellService: NutshellService,
	) {}

	public onModuleInit() {
		this.type = this.configService.get('cashu.type');
		this.initializeGrpcClient();
	}

	private initializeGrpcClient() {
		if (this.type === 'cdk') this.grpc_client = this.cdkService.initializeGrpcClient();
		if (this.type === 'nutshell') this.grpc_client = this.nutshellService.initializeGrpcClient();
	}

	private makeGrpcRequest(method: string, request: any): Promise<any> {
		if (!this.grpc_client) throw OrchardErrorCode.MintRpcConnectionError;

		return new Promise((resolve, reject) => {
			if (!(method in this.grpc_client)) reject(OrchardErrorCode.MintSupportError);
			this.grpc_client[method](request, (error: ServiceError | null, response: any) => {
				if (error) {
					this.logger.debug(`gRPC error: ${error.message}`);

					switch (error.code) {
						case status.INVALID_ARGUMENT:
							reject({code: OrchardErrorCode.MintRpcInvalidArgumentError, details: error.details});
							break;
						case status.UNIMPLEMENTED:
							reject({code: OrchardErrorCode.MintSupportError, details: error.details});
							break;
						case status.INTERNAL:
							reject({code: OrchardErrorCode.MintRpcInternalError, details: error.details});
							break;
						case status.UNAVAILABLE:
							reject({code: OrchardErrorCode.MintRpcConnectionError, details: error.details});
							break;
						default:
							reject(error);
					}
					return;
				}
				resolve(response);
			});
		});
	}

	async getMintInfo(): Promise<CashuMintInfoRpc> {
		const info = await this.makeGrpcRequest('GetInfo', {});
		info.description_long = info.long_description;
		return info;
	}

	async getQuoteTtl(): Promise<{mint_ttl: number; melt_ttl: number}> {
		if (this.type === 'cdk') return this.makeGrpcRequest('GetQuoteTtl', {});
		if (this.type === 'nutshell') return {mint_ttl: null, melt_ttl: null};
	}

	async updateName({name}: {name: string | null}): Promise<{}> {
		return this.makeGrpcRequest('UpdateName', {name});
	}

	async updateMotd({motd}: {motd: string}): Promise<{}> {
		return this.makeGrpcRequest('UpdateMotd', {motd});
	}

	async updateShortDescription({description}: {description: string}): Promise<{}> {
		return this.makeGrpcRequest('UpdateShortDescription', {description});
	}

	async updateLongDescription({description}: {description: string}): Promise<{}> {
		return this.makeGrpcRequest('UpdateLongDescription', {description});
	}

	async updateIconUrl({icon_url}: {icon_url: string}): Promise<{}> {
		return this.makeGrpcRequest('UpdateIconUrl', {icon_url});
	}

	async addUrl({url}: {url: string}): Promise<{}> {
		return this.makeGrpcRequest('AddUrl', {url});
	}

	async removeUrl({url}: {url: string}): Promise<{}> {
		return this.makeGrpcRequest('RemoveUrl', {url});
	}

	async addContact({method, info}: {method: string; info: string}): Promise<{}> {
		return this.makeGrpcRequest('AddContact', {method, info});
	}

	async removeContact({method, info}: {method: string; info: string}): Promise<{}> {
		return this.makeGrpcRequest('RemoveContact', {method, info});
	}

	async updateNut04({
		unit,
		method,
		disabled,
		min_amount,
		max_amount,
		description,
	}: {
		unit: string;
		method: string;
		disabled?: boolean;
		min_amount?: number;
		max_amount?: number;
		description?: boolean;
	}): Promise<{}> {
		const request: any = {unit, method};
		if (disabled !== undefined) request.disabled = disabled;
		if (min_amount !== undefined) request.min_amount = min_amount;
		if (max_amount !== undefined) request.max_amount = max_amount;
		if (description !== undefined) {
			request.options = {description};
		}
		return this.makeGrpcRequest('UpdateNut04', request);
	}

	async updateNut05({
		unit,
		method,
		disabled,
		min_amount,
		max_amount,
		amountless,
	}: {
		unit: string;
		method: string;
		disabled?: boolean;
		min_amount?: number;
		max_amount?: number;
		amountless?: boolean;
	}): Promise<{}> {
		const request: any = {unit, method};
		if (disabled !== undefined) request.disabled = disabled;
		if (min_amount !== undefined) request.min_amount = min_amount;
		if (max_amount !== undefined) request.max_amount = max_amount;
		if (amountless !== undefined) {
			request.options = {amountless};
		}
		return this.makeGrpcRequest('UpdateNut05', request);
	}

	async updateQuoteTtl({mint_ttl, melt_ttl}: {mint_ttl?: number; melt_ttl?: number}): Promise<{}> {
		const request: any = {};
		if (mint_ttl !== undefined) request.mint_ttl = mint_ttl;
		if (melt_ttl !== undefined) request.melt_ttl = melt_ttl;
		return this.makeGrpcRequest('UpdateQuoteTtl', request);
	}

	async updateNut04Quote({quote_id, state}: {quote_id: string; state: string}): Promise<{quote_id: string; state: string}> {
		return this.makeGrpcRequest('UpdateNut04Quote', {quote_id, state});
	}

	async rotateNextKeyset({
		unit,
		max_order,
		input_fee_ppk,
	}: {
		unit: string;
		max_order?: number;
		input_fee_ppk?: number;
	}): Promise<{id: string; unit: string; max_order: number; input_fee_ppk: number}> {
		const request: any = {unit};
		if (max_order !== undefined) request.max_order = max_order;
		if (input_fee_ppk !== undefined) request.input_fee_ppk = input_fee_ppk;
		return this.makeGrpcRequest('RotateNextKeyset', request);
	}
}
