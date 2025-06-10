/* Core Dependencies */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { LightningType } from '@server/modules/lightning/lightning.enums';
import { LndService } from '@server/modules/lightning/lnd/lnd.service';
/* Local Dependencies */
import { LightningInfo, LightningChannelBalance } from './lnrpc.types';

@Injectable()
export class LightningRpcService implements OnModuleInit {

    private readonly logger = new Logger(LightningRpcService.name);
    
    private grpc_client: any = null;
    private type: LightningType;

    constructor(
        private configService: ConfigService,
        private lndService: LndService,
    ) {}

    public async onModuleInit() {
		this.type = this.configService.get('lightning.type');
        this.initializeGrpcClient();
	}

        
    private initializeGrpcClient() {
        if( this.type === 'lnd' ) this.grpc_client = this.lndService.initializeGrpcClient();
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
    
    async getLightningInfo() : Promise<LightningInfo> {
        return this.makeGrpcRequest('GetInfo', {});
    }

    async getLightningChannelBalance() : Promise<LightningChannelBalance> {
        return this.makeGrpcRequest('ChannelBalance', {});
    }

}
