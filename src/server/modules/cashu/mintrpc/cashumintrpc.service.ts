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
        if (!this.grpc_client) throw OrchardErrorCode.MintRpcError;
        
        return new Promise((resolve, reject) => {
            if (!(method in this.grpc_client)) {
                reject(OrchardErrorCode.MintSupportError);
                return;
            }
            
            this.grpc_client[method](request, (error: Error | null, response: any) => {
                if (error) reject(error);
                resolve(response);
            });
        });
    }
    
    /**
     * Get mint information
     */
    async getMintInfo() : Promise<CashuMintInfoRpc> {
        return this.makeGrpcRequest('GetInfo', {});
    }
    
    /**
     * Update mint name
     */
    async updateName(name: string) : Promise<{}> {
        return this.makeGrpcRequest('UpdateName', { name });
    }
    
    /**
     * Update mint message of the day
     */
    async updateMotd(motd: string) {
        return this.makeGrpcRequest('UpdateMotd', { motd });
    }
    
    /**
     * Update mint short description
     */
    async updateShortDescription(description: string) {
        return this.makeGrpcRequest('UpdateShortDescription', { description });
    }
    
    /**
     * Update mint long description
     */
    async updateLongDescription(description: string) {
        return this.makeGrpcRequest('UpdateLongDescription', { description });
    }
    
    /**
     * Update mint icon URL
     */
    async updateIconUrl(icon_url: string) {
        return this.makeGrpcRequest('UpdateIconUrl', { icon_url });
    }
    
    /**
     * Add a URL to the mint
     */
    async addUrl(url: string) {
        return this.makeGrpcRequest('AddUrl', { url });
    }
    
    /**
     * Remove a URL from the mint
     */
    async removeUrl(url: string) {
        return this.makeGrpcRequest('RemoveUrl', { url });
    }
    
    /**
     * Add a contact method to the mint
     */
    async addContact(method: string, info: string) {
        return this.makeGrpcRequest('AddContact', { method, info });
    }
    
    /**
     * Remove a contact method from the mint
     */
    async removeContact(method: string, info: string) {
        return this.makeGrpcRequest('RemoveContact', { method, info });
    }
    
    /**
     * Rotate to the next keyset
     */
    async rotateNextKeyset(unit: string, max_order?: number, input_fee_ppk?: number) {
        const request: any = { unit };
        if (max_order !== undefined) request.max_order = max_order;
        if (input_fee_ppk !== undefined) request.input_fee_ppk = input_fee_ppk;
        
        return this.makeGrpcRequest('RotateNextKeyset', request);
    }
}