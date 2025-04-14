/* Core Dependencies */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { CdkService } from '@server/modules/cashu/cdk/cdk.service';
import { OrchardErrorCode } from '@server/modules/error/error.types';
/* Local Dependencies */
import { CashuMintInfoRpc } from './cashumintrpc.types';

@Injectable()
export class CashuMintRpcService implements OnModuleInit {

    private readonly logger = new Logger(CashuMintRpcService.name);
    private grpc_client: any = null;
    private backend: 'cdk' | 'nutshell';

    constructor(
        private configService: ConfigService,
        private cdkService: CdkService,
    ) {}

    public async onModuleInit() {
		this.backend = this.configService.get('cashu.backend');
        this.initializeGrpcClient();
	}
    
    private initializeGrpcClient() {
        if( this.backend === 'nutshell' ) this.logger.warn('Nutshell backend does not support gRPC');
        if( this.backend === 'cdk' ) this.grpc_client = this.cdkService.initializeGrpcClient();
    }

    private makeGrpcRequest(method: string, request: any): Promise<any> {
        if (!this.grpc_client) throw OrchardErrorCode.MintRpcConnectionError;
        
        return new Promise((resolve, reject) => {
            if (!(method in this.grpc_client)) reject(OrchardErrorCode.MintSupportError);
            this.grpc_client[method](request, (error: Error | null, response: any) => {
                if (error && error?.message?.includes('14 UNAVAILABLE')) reject(OrchardErrorCode.MintRpcConnectionError);
                if (error) reject(error);
                resolve(response);
            });
        });
    }
    
    async getMintInfo() : Promise<CashuMintInfoRpc> {
        return this.makeGrpcRequest('GetInfo', {});
    }

    async getQuoteTtl() : Promise<{ mint_ttl: number, melt_ttl: number }> {
        return this.makeGrpcRequest('GetQuoteTtl', {});
    }

    async updateName({ name }: { name: string }) : Promise<{}> {
        return this.makeGrpcRequest('UpdateName', { name });
    }

    async updateMotd({ motd }: { motd: string }) : Promise<{}> {
        return this.makeGrpcRequest('UpdateMotd', { motd });
    }

    async updateShortDescription({ description }: { description: string }) : Promise<{}> {
        return this.makeGrpcRequest('UpdateShortDescription', { description });
    }

    async updateLongDescription({ description }: { description: string }) : Promise<{}> {
        return this.makeGrpcRequest('UpdateLongDescription', { description });
    }

    async updateIconUrl({ icon_url }: { icon_url: string }) : Promise<{}> {
        return this.makeGrpcRequest('UpdateIconUrl', { icon_url });
    }
    
    async addUrl({ url }: { url: string }) : Promise<{}> {
        return this.makeGrpcRequest('AddUrl', { url });
    }
    
    async removeUrl({ url }: { url: string }) : Promise<{}> {
        return this.makeGrpcRequest('RemoveUrl', { url });
    }

    async addContact({ method, info }: { method: string, info: string }) : Promise<{}> {
        return this.makeGrpcRequest('AddContact', { method, info });
    }

    async removeContact({ method, info }: { method: string, info: string }) : Promise<{}> {
        return this.makeGrpcRequest('RemoveContact', { method, info });
    }

    async updateNut04({ 
        unit,
        method,
        disabled,
        min,
        max,
        description
    }: {
        unit: string,
        method: string,
        disabled?: boolean,
        min?: number,
        max?: number,
        description?: boolean 
    }) : Promise<{}> {
        const request: any = { unit, method };
        if (disabled !== undefined) request.disabled = disabled;
        if (min !== undefined) request.min = min;
        if (max !== undefined) request.max = max;
        if (description !== undefined) request.description = description;
        console.log('gRPC request: ', request);
        return this.makeGrpcRequest('UpdateNut04', request);
    }

    async updateNut05({
        unit,
        method,
        disabled,
        min,
        max
    }: {
        unit: string,
        method: string,
        disabled?: boolean,
        min?: number,
        max?: number 
    }) : Promise<{}> {
        const request: any = { unit, method };
        if (disabled !== undefined) request.disabled = disabled;
        if (min !== undefined) request.min = min;
        if (max !== undefined) request.max = max;
        return this.makeGrpcRequest('UpdateNut05', request);
    }

    async updateQuoteTtl({ mint_ttl, melt_ttl }: { mint_ttl?: number, melt_ttl?: number }) : Promise<{}> {
        const request: any = {};
        if (mint_ttl !== undefined) request.mint_ttl = mint_ttl;
        if (melt_ttl !== undefined) request.melt_ttl = melt_ttl;
        return this.makeGrpcRequest('UpdateQuoteTtl', request);
    }

    async updateNut04Quote({ quote_id, state }: { quote_id: string, state: string }) : Promise<{ quote_id: string, state: string }> {
        return this.makeGrpcRequest('UpdateNut04Quote', { quote_id, state });
    }

    async rotateNextKeyset({
        unit,
        max_order,
        input_fee_ppk
    }: {
        unit: string,
        max_order?: number,
        input_fee_ppk?: number 
    }) : Promise<{ id: string, unit: string, max_order: number, input_fee_ppk: number }> {
        const request: any = { unit };
        if (max_order !== undefined) request.max_order = max_order;
        if (input_fee_ppk !== undefined) request.input_fee_ppk = input_fee_ppk;
        return this.makeGrpcRequest('RotateNextKeyset', request);
    }
}