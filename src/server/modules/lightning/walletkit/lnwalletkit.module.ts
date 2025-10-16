/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {FetchModule} from '@server/modules/fetch/fetch.module';
import {LndModule} from '@server/modules/lightning/lnd/lnd.module';
import {ClnModule} from '@server/modules/lightning/cln/cln.module';
import {LnbitsModule} from '@server/modules/lightning/lnbits/lnbits.module';
/* Local Dependencies */
import {LightningWalletKitService} from './lnwalletkit.service';

@Module({
	imports: [FetchModule, LndModule, ClnModule, LnbitsModule],
	providers: [LightningWalletKitService],
	exports: [LightningWalletKitService],
})
export class LightningWalletKitModule {}
