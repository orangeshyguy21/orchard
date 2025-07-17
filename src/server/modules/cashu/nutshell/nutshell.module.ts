/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {NutshellService} from './nutshell.service';

@Module({
	providers: [NutshellService],
	exports: [NutshellService],
})
export class NutshellModule {}
