/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintAnalytics } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintAnalyticsArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintAnalytics } from './mintanalytics.model';

@Injectable()
export class MintAnalyticsService {

	private readonly logger = new Logger(MintAnalyticsService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintAnalyticsBalances(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsBalances(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint analytics',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintAnalyticsMints(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsMints(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint analytics',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintAnalyticsMelts(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsMelts(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint analytics',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintAnalyticsTransfers(args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsTransfers(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error,
					errord: OrchardErrorCode.MintDatabaseSelectError,
					msg: 'Error getting mint analytics',
				});
				throw new OrchardApiError(error_code);
			}
		});
	}
}