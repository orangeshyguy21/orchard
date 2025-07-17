/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {FetchModule} from '@server/modules/fetch/fetch.module';
import {LndModule} from '@server/modules/lightning/lnd/lnd.module';
/* Local Dependencies */
import {LightningWalletKitService} from './lnwalletkit.service';

@Module({
	imports: [FetchModule, LndModule],
	providers: [LightningWalletKitService],
	exports: [LightningWalletKitService],
})
export class LightningWalletKitModule {}
