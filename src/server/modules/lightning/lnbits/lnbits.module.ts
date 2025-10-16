/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CredentialModule} from '@server/modules/credential/credential.module';
import {FetchModule} from '@server/modules/fetch/fetch.module';
/* Local Dependencies */
import {LnbitsService} from './lnbits.service';

@Module({
	imports: [CredentialModule, FetchModule],
	providers: [LnbitsService],
	exports: [LnbitsService],
})
export class LnbitsModule {}