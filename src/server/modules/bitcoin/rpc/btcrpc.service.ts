
/* Core Dependencies */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* Application Dependencies */
import { OrchardErrorCode } from '@server/modules/error/error.types';
import { BitcoinType } from '@server/modules/bitcoin/bitcoin.enums';
import { CoreService } from '@server/modules/bitcoin/core/core.service';
/* Local Dependencies */
// import { BitcoinInfo } from './btcrpc.types';

@Injectable()
export class BitcoinRpcService implements OnModuleInit {

    private readonly logger = new Logger(BitcoinRpcService.name);
    
    private type: BitcoinType;

    constructor(
        private configService: ConfigService,
        private coreService: CoreService,
    ) {}

    public async onModuleInit() {
		this.type = this.configService.get('bitcoin.type');
        this.initializeRpc();
	}

    private initializeRpc() {
        if( this.type === BitcoinType.CORE ) this.coreService.initializeRpc();
    }

    async getBitcoinInfo() : Promise<number> {
        if( this.type === BitcoinType.CORE ) return this.coreService.makeRpcRequest('getblockcount', []);
    }
}