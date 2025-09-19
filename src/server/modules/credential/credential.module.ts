/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {CredentialService} from './credential.service';

@Module({
	providers: [CredentialService],
	exports: [CredentialService],
})
export class CredentialModule {}
