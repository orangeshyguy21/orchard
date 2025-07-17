/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { BitcoinRpcModule } from "@server/modules/bitcoin/rpc/btcrpc.module";
/* Internal Dependencies */
import { BtcTransactionResolver } from './btctransaction.resolver';
import { BtcTransactionService } from './btctransaction.service';

@Module({
	imports: [
		ErrorModule,
		BitcoinRpcModule,
	],
	providers: [
		BtcTransactionResolver,
		BtcTransactionService,
	],
})
export class BitcoinTransactionModule {}
