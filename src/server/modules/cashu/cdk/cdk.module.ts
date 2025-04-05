/* Core Dependencies */
import { Module } from '@nestjs/common';
/* Local Dependencies */
import { CdkService } from './cdk.service';

@Module({
	providers: [CdkService],
	exports: [CdkService],
})
export class CdkModule {}
