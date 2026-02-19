/* Vendor Dependencies */
import {DataSource} from 'typeorm';
/* Application Dependencies */
import {User} from '../modules/user/user.entity';
import {Invite} from '../modules/invite/invite.entity';
import {TokenBlacklist} from '../modules/auth/token-blacklist.entity';
import {Setting} from '../modules/setting/setting.entity';
import {UTXOracle} from '../modules/bitcoin/utxoracle/utxoracle.entity';
import {AnalyticsCheckpoint} from '../modules/analytics/analytics-checkpoint.entity';
import {LightningAnalytics} from '../modules/lightning/analytics/lnanalytics.entity';
import {ChangeEvent} from '../modules/change/change-event.entity';
import {ChangeDetail} from '../modules/change/change-detail.entity';

export const AppDataSource = new DataSource({
	type: 'better-sqlite3',
	database: process.env.DATABASE_DIR ? `${process.env.DATABASE_DIR}/orchard.db` : 'data/orchard.db',
	entities: [User, Invite, TokenBlacklist, Setting, UTXOracle, AnalyticsCheckpoint, LightningAnalytics, ChangeEvent, ChangeDetail],
	migrations: ['src/server/database/migrations/*.ts'],
	synchronize: false,
});
