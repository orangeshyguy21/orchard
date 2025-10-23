/* Vendor Dependencies */
import {DataSource} from 'typeorm';
/* Application Dependencies */
import {User} from '../modules/user/user.entity';
import {Invite} from '../modules/user/invite.entity';

export const AppDataSource = new DataSource({
	type: 'better-sqlite3',
	database: process.env.DATABASE_DIR ? `${process.env.DATABASE_DIR}/orchard.db` : 'data/orchard.db',
	entities: [User, Invite],
	migrations: ['src/server/database/migrations/*.ts'],
	synchronize: false,
});
