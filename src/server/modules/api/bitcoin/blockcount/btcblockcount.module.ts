/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { BitcoinRpcModule } from "@server/modules/bitcoin/rpc/btcrpc.module";
/* Internal Dependencies */
import { BitcoinBlockCountResolver } from "./btcblockcount.resolver";
import { BitcoinBlockCountService } from "./btcblockcount.service";

@Module({
	imports: [
		ErrorModule,
		BitcoinRpcModule,
	],
	providers: [
		BitcoinBlockCountResolver,
		BitcoinBlockCountService,
	],
})
export class BitcoinBlockCountModule {}
