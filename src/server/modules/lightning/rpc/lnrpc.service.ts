/* Core Dependencies */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { LightningType } from '@server/modules/lightning/lightning.enums';
import { LndService } from '@server/modules/lightning/lnd/lnd.service';

@Injectable()
export class LnRpcService implements OnModuleInit {

    private readonly logger = new Logger(LnRpcService.name);
    
    private grpc_client: any = null;
    private type: LightningType;

    constructor(
        private configService: ConfigService,
        private lndService: LndService,
    ) {}

    public async onModuleInit() {
        console.log('LnRpcService onModuleInit');
		this.type = this.configService.get('lightning.type');
        this.initializeGrpcClient();
	}

        
    private initializeGrpcClient() {
        if( this.type === 'lnd' ) this.grpc_client = this.lndService.initializeGrpcClient();
    }

}
