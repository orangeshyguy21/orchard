/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintQuoteState, MeltQuoteState} from '@server/modules/cashu/cashu.enums';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {OrchardMintPulse, OrchardMintPulseActivity, OrchardMintPulseQuoteRate} from './mintpulse.model';

type TimePair = {created: number; completed: number | null};

@Injectable()
export class MintPulseService {
	private readonly logger = new Logger(MintPulseService.name);

	constructor(
		private cashuMintDatabaseService: CashuMintDatabaseService,
		private mintService: MintService,
		private errorService: ErrorService,
	) {}

	/** Fetches aggregated mint health metrics in a single database session. */
	async getMintPulse(tag: string): Promise<OrchardMintPulse> {
		return this.mintService.withDbClient(async (client) => {
			try {
				const now = Math.floor(Date.now() / 1000);
				const twenty_four_hours_ago = now - 86400;
				const forty_eight_hours_ago = now - 172800;

				const [
					current_mint_count,
					current_melt_count,
					current_swap_count,
					previous_mint_count,
					previous_melt_count,
					previous_swap_count,
					total_mint_quotes,
					issued_mint_quotes,
					total_melt_quotes,
					paid_melt_quotes,
					last_mint_time,
					last_melt_time,
					last_swap_time,
					completed_mint_quotes,
					completed_melt_quotes,
				] = await Promise.all([
					this.cashuMintDatabaseService.getMintCountMintQuotes(client, {
						date_start: twenty_four_hours_ago,
						date_end: now,
					}),
					this.cashuMintDatabaseService.getMintCountMeltQuotes(client, {
						date_start: twenty_four_hours_ago,
						date_end: now,
					}),
					this.cashuMintDatabaseService.getMintCountSwaps(client, {
						date_start: twenty_four_hours_ago,
						date_end: now,
					}),
					this.cashuMintDatabaseService.getMintCountMintQuotes(client, {
						date_start: forty_eight_hours_ago,
						date_end: twenty_four_hours_ago,
					}),
					this.cashuMintDatabaseService.getMintCountMeltQuotes(client, {
						date_start: forty_eight_hours_ago,
						date_end: twenty_four_hours_ago,
					}),
					this.cashuMintDatabaseService.getMintCountSwaps(client, {
						date_start: forty_eight_hours_ago,
						date_end: twenty_four_hours_ago,
					}),
					this.cashuMintDatabaseService.getMintCountMintQuotes(client),
					this.cashuMintDatabaseService.getMintCountMintQuotes(client, {
						states: [MintQuoteState.ISSUED],
					}),
					this.cashuMintDatabaseService.getMintCountMeltQuotes(client),
					this.cashuMintDatabaseService.getMintCountMeltQuotes(client, {
						states: [MeltQuoteState.PAID],
					}),
					this.cashuMintDatabaseService.getMintLastMintQuoteTime(client).catch((e) => {
						this.logger.warn(`Failed to get last mint quote time: ${e?.message ?? e}`);
						return null;
					}),
					this.cashuMintDatabaseService.getMintLastMeltQuoteTime(client).catch((e) => {
						this.logger.warn(`Failed to get last melt quote time: ${e?.message ?? e}`);
						return null;
					}),
					this.cashuMintDatabaseService.getMintLastSwapTime(client).catch((e) => {
						this.logger.warn(`Failed to get last swap time: ${e?.message ?? e}`);
						return null;
					}),
					this.cashuMintDatabaseService.getMintMintQuotes(client, {
						states: [MintQuoteState.ISSUED],
					}).catch((e) => {
						this.logger.warn(`Failed to get completed mint quotes: ${e?.message ?? e}`);
						return [];
					}),
					this.cashuMintDatabaseService.getMintMeltQuotes(client, {
						states: [MeltQuoteState.PAID],
					}).catch((e) => {
						this.logger.warn(`Failed to get completed melt quotes: ${e?.message ?? e}`);
						return [];
					}),
				]);

				const current_24h = new OrchardMintPulseActivity(current_mint_count, current_melt_count, current_swap_count);
				const previous_24h = new OrchardMintPulseActivity(previous_mint_count, previous_melt_count, previous_swap_count);
				const mint_quote_rate = new OrchardMintPulseQuoteRate(total_mint_quotes, issued_mint_quotes);
				const melt_quote_rate = new OrchardMintPulseQuoteRate(total_melt_quotes, paid_melt_quotes);
				const avg_mint_time = this.computeAvgTime(completed_mint_quotes.map(q => ({created: q.created_time, completed: q.paid_time})));
				const avg_melt_time = this.computeAvgTime(completed_melt_quotes.map(q => ({created: q.created_time, completed: q.paid_time})));

				return new OrchardMintPulse(
					current_24h,
					previous_24h,
					mint_quote_rate,
					melt_quote_rate,
					last_mint_time,
					last_melt_time,
					last_swap_time,
					avg_mint_time,
					avg_melt_time,
				);
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}

	/** Computes average time difference in milliseconds from creation to completion, rounded to nearest integer. */
	private computeAvgTime(pairs: TimePair[]): number | null {
		const valid_pairs = pairs.filter(p => p.completed !== null && p.completed > p.created);
		if (valid_pairs.length === 0) return null;
		const total = valid_pairs.reduce((sum, p) => sum + (p.completed - p.created), 0);
		return Math.round((total / valid_pairs.length) * 1000);
	}
}
