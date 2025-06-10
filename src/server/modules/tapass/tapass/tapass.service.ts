/* Core Dependencies */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { TaprootAssetType } from '@server/modules/tapass/tapass.enums';
import { TapdService } from '@server/modules/tapass/tapd/tapd.service';
/* Local Dependencies */
// import { LightningInfo, LightningChannelBalance } from './lightning.types';

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
		this.type = this.configService.get('taproot_asset.type');
        this.initializeGrpcClients();
	}
        
    private initializeGrpcClients() {
        if( this.type === 'tapd' ) this.grpc_client = this.tapdService.initializeTaprootAssetsClient();
    }

    private makeGrpcRequest(method: string, request: any): Promise<any> {
        if (!this.grpc_client) throw OrchardErrorCode.LightningRpcConnectionError;
        
        return new Promise((resolve, reject) => {
            if (!(method in this.grpc_client)) reject(OrchardErrorCode.LightningSupportError);
            this.grpc_client[method](request, (error: Error | null, response: any) => {
                console.log('error', error);
                console.log('response', response);
                if (error && error?.message?.includes('14 UNAVAILABLE')) reject(OrchardErrorCode.LightningRpcConnectionError);
                if (error) reject(error);
                resolve(response);
            });
        });
    }

    async getTaprootAssetsBalance() : Promise<any> {
        return this.makeGrpcRequest('ListBalances', {});
    }
}