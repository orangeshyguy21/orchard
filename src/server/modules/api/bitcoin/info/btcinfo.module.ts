/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { BitcoinRpcModule } from "@server/modules/bitcoin/rpc/btcrpc.module";
/* Internal Dependencies */
import { BitcoinInfoResolver } from "./btcinfo.resolver";
import { BitcoinInfoService } from "./btcinfo.service";

@Module({
	imports: [
		ErrorModule,
		BitcoinRpcModule,
	],
	providers: [
		BitcoinInfoResolver,
		BitcoinInfoService,
	],
})
export class BitcoinInfoModule {}
