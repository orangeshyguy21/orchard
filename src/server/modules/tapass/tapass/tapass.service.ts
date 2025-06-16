/* Core Dependencies */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { TaprootAssetType } from '@server/modules/tapass/tapass.enums';
import { TapdService } from '@server/modules/tapass/tapd/tapd.service';
/* Local Dependencies */
import { TaprootAssetsInfo, TaprootAssetsUtxos, TaprootAssets } from './tapass.types';

@Injectable()
export class TaprootAssetsService implements OnModuleInit {

    private readonly logger = new Logger(TaprootAssetsService.name);
    
    private grpc_client: any = null;
    private type: TaprootAssetType;

    constructor(
        private configService: ConfigService,
        private tapdService: TapdService,
    ) {}

    public async onModuleInit() {
		this.type = this.configService.get('taproot_assets.type');
        this.initializeGrpcClients();
	}
        
    private initializeGrpcClients() {
        if( this.type === 'tapd' ) this.grpc_client = this.tapdService.initializeTaprootAssetsClient();
    }

    private makeGrpcRequest(method: string, request: any): Promise<any> {
        if (!this.grpc_client) throw OrchardErrorCode.TaprootAssetsRpcConnectionError;
        
        return new Promise((resolve, reject) => {
            if (!(method in this.grpc_client)) reject(OrchardErrorCode.TaprootAssetsSupportError);
            this.grpc_client[method](request, (error: Error | null, response: any) => {
                if (error && error?.message?.includes('14 UNAVAILABLE')) reject(OrchardErrorCode.TaprootAssetsRpcConnectionError);
                if (error) reject(error);
                resolve(response);
            });
        });
    }

    async getTaprootAssetsInfo() : Promise<TaprootAssetsInfo> {   
        return this.makeGrpcRequest('GetInfo', {});
    }

    async getListTaprootAssets() : Promise<TaprootAssets> {   
        return this.makeGrpcRequest('ListAssets', {});
    }

    async getListTaprootAssetsUtxos() : Promise<TaprootAssetsUtxos> {   
        return this.makeGrpcRequest('ListUtxos', {});
    }
}