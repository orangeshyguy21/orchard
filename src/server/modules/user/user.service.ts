/* Core Dependencies */
import {Injectable} from '@nestjs/common';
/* Local Dependencies */
import {User} from './user.types';

@Injectable()
export class UserService {
	private readonly users = [
		{
			id: '1',
			name: 'Admin',
		},
	];

	public getUser(): User {
		return this.users[0];
	}
}
