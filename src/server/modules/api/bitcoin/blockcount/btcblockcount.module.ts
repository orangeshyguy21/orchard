/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { BitcoinModule } from "@server/modules/bitcoin/bitcoin.module";
/* Internal Dependencies */
import { BitcoinBlockCountResolver } from "./btcblockcount.resolver";
import { BitcoinBlockCountService } from "./btcblockcount.service";

@Module({
	imports: [
		ErrorModule,
		BitcoinModule,
	],
	providers: [
		BitcoinBlockCountResolver,
		BitcoinBlockCountService,
	],
})
export class BitcoinBlockCountModule {}
