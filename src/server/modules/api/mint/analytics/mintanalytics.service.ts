/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintAnalytics } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintAnalyticsArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
/* Local Dependencies */
import { OrchardMintAnalytics } from './mintanalytics.model';

@Injectable()
export class MintAnalyticsService {

	private readonly logger = new Logger(MintAnalyticsService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
	) {}

	async getMintAnalyticsBalances(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsBalances(db, args);
			return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
		} catch (error) {
			this.logger.error('Error getting mint analytics', error);
			throw error;
		} finally {
			db.close();
		}
	}

	async getMintAnalyticsMints(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsMints(db, args);
			return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
		} catch (error) {
			this.logger.error('Error getting mint analytics', error);
			throw error;
		} finally {
			db.close();
		}
	}

	async getMintAnalyticsMelts(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsMelts(db, args);
			return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
		} catch (error) {
			this.logger.error('Error getting mint analytics', error);
			throw error;
		} finally {
			db.close();
		}
	}

	async getMintAnalyticsTransfers(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		const db = this.cashuMintDatabaseService.getMintDatabase();
		try {
			const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsTransfers(db, args);
			return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
		} catch (error) {
			this.logger.error('Error getting mint analytics', error);
			throw error;
		} finally {
			db.close();
		}
	}
}