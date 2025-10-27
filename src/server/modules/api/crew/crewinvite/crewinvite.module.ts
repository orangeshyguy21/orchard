/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Application Dependencies */
import {ErrorModule} from '@server/modules/error/error.module';
import {InviteModule} from '@server/modules/invite/invite.module';
/* Local Dependencies */
import {CrewInviteService} from './crewinvite.service';
import {CrewInviteResolver} from './crewinvite.resolver';

@Module({
	imports: [ErrorModule, InviteModule],
	providers: [CrewInviteResolver, CrewInviteService],
})
export class CrewInviteModule {}
