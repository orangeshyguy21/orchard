/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintAnalytics } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintAnalyticsArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardApiErrorCode } from "@server/modules/graphql/errors/orchard.errors";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
/* Local Dependencies */
import { OrchardMintAnalytics } from './mintanalytics.model';

@Injectable()
export class MintAnalyticsService {

	private readonly logger = new Logger(MintAnalyticsService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
	) {}

	async getMintAnalyticsBalances(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsBalances(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				this.logger.error('Error getting mint analytics');
				this.logger.debug(`Error getting mint analytics: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}

	async getMintAnalyticsMints(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsMints(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				this.logger.error('Error getting mint analytics');
				this.logger.debug(`Error getting mint analytics: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}

	async getMintAnalyticsMelts(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsMelts(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				this.logger.error('Error getting mint analytics');
				this.logger.debug(`Error getting mint analytics: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}

	async getMintAnalyticsTransfers(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsTransfers(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				this.logger.error('Error getting mint analytics');
				this.logger.debug(`Error getting mint analytics: ${error}`);
				throw new OrchardApiError(OrchardApiErrorCode.MintDatabaseSelectError);
			}
		});
	}
}