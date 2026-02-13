/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Local Dependencies */
import {PublicPortService} from './port.service';
import {PublicPortResolver} from './port.resolver';

@Module({
	providers: [PublicPortResolver, PublicPortService],
})
export class PublicPortModule {}
