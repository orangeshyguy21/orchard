/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashumintdb/cashumintdb.service';
import { CashuMintAnalytics } from '@server/modules/cashumintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintAnalytics } from './mintanalytics.model';

@Injectable()
export class MintAnalyticsService {

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
	) {}

	async getMintAnalyticsBalances() : Promise<OrchardMintAnalytics[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsBalances(db);
			console.log('cashu_mint_analytics', cashu_mint_analytics);
			return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
		} catch (error) {
			this.logger.error('Error getting mint analytics', { error });
			throw new Error(error);
		} finally {
			db.close();
		}
	}
}