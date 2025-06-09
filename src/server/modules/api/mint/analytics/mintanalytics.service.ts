/* Core Dependencies */
import { Injectable, Logger } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashu/mintdb/cashumintdb.service';
import { CashuMintAnalytics, CashuMintKeysetsAnalytics } from '@server/modules/cashu/mintdb/cashumintdb.types';
import { CashuMintAnalyticsArgs } from '@server/modules/cashu/mintdb/cashumintdb.interfaces';
import { OrchardErrorCode } from "@server/modules/error/error.types";
import { OrchardApiError } from "@server/modules/graphql/classes/orchard-error.class";
import { MintService } from '@server/modules/api/mint/mint.service';
import { ErrorService } from '@server/modules/error/error.service';
/* Local Dependencies */
import { OrchardMintAnalytics, OrchardMintKeysetsAnalytics } from './mintanalytics.model';

@Injectable()
export class MintAnalyticsService {

	private readonly logger = new Logger(MintAnalyticsService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	async getMintAnalyticsBalances(tag: string, args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsBalances(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintAnalyticsMints(tag: string, args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsMints(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintAnalyticsMelts(tag: string, args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsMelts(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintAnalyticsTransfers(tag: string, args:CashuMintAnalyticsArgs) : Promise<OrchardMintAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsTransfers(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintAnalytics(cma) );
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}

	async getMintAnalyticsKeysets(tag: string, args:CashuMintAnalyticsArgs) : Promise<OrchardMintKeysetsAnalytics[]> {
		return this.mintService.withDb(async (db) => {
			try {
				const cashu_mint_analytics : CashuMintKeysetsAnalytics[] = await this.cashuMintDatabaseService.getMintAnalyticsKeysets(db, args);
				return cashu_mint_analytics.map( cma => new OrchardMintKeysetsAnalytics(cma) );
			} catch (error) {
				const error_code = this.errorService.resolveError({ logger: this.logger, error, msg: tag,
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(error_code);
			}
		});
	}
}