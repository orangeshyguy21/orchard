/* Core Dependencies */
import { Module } from "@nestjs/common";
/* Application Dependencies */
import { ErrorModule } from "@server/modules/error/error.module";
import { LightningWalletKitModule } from "@server/modules/lightning/walletkit/lnwalletkit.module";
/* Local Dependencies */
import { LightningWalletService } from "./lnwallet.service";
import { LightningWalletResolver } from "./lnwallet.resolver";

@Module({
	imports: [
		LightningWalletKitModule,
		ErrorModule,
	],
	providers: [
		LightningWalletService,
		LightningWalletResolver,
	]
})
export class LightningWalletModule {}
