/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CredentialModule} from '@server/modules/credential/credential.module';
/* Local Dependencies */
import {LndService} from './lnd.service';

@Module({
	imports: [CredentialModule],
	providers: [LndService],
	exports: [LndService],
})
export class LndModule {}
