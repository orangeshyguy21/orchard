/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Vendor Dependencies */
import {TypeOrmModule} from '@nestjs/typeorm';
/* Local Dependencies */
import {Invite} from './invite.entity';
import {InviteService} from './invite.service';

@Module({
	imports: [TypeOrmModule.forFeature([Invite])],
	providers: [InviteService],
	exports: [InviteService],
})
export class InviteModule {}
