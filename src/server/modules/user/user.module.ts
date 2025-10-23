/* Core Dependencies */
import {Module} from '@nestjs/common';
/* Vendor Dependencies */
import {TypeOrmModule} from '@nestjs/typeorm';
/* Local Dependencies */
import {Invite} from './invite.entity';
import {User} from './user.entity';
import {UserService} from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([Invite, User])],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
