/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashumintdb/cashumintdb.service';
import { CashuMintAnalytics } from '@server/modules/cashumintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintAnalytics } from './mintanalytics.model';

@Injectable()
export class MintAnalyticsService {

	private readonly logger = new Logger(MintAnalyticsService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	async getMintAnalyticsBalances() : Promise<OrchardMintAnalytics[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsBalances(db);
			return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
		} catch (error) {
			this.logger.error('Error getting mint analytics', { error });
			throw new Error(error);
		} finally {
			db.close();
		}
	}
}