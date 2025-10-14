/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {CredentialModule} from '@server/modules/credential/credential.module';
/* Local Dependencies */
import {ClnService} from './cln.service';

@Module({
	imports: [CredentialModule],
	providers: [ClnService],
	exports: [ClnService],
})
export class ClnModule {}
