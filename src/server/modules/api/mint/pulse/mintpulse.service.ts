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
				]);

				const current_24h = new OrchardMintPulseActivity(current_mint_count, current_melt_count, current_swap_count);
				const previous_24h = new OrchardMintPulseActivity(previous_mint_count, previous_melt_count, previous_swap_count);
				const mint_quote_rate = new OrchardMintPulseQuoteRate(total_mint_quotes, issued_mint_quotes);
				const melt_quote_rate = new OrchardMintPulseQuoteRate(total_melt_quotes, paid_melt_quotes);

				return new OrchardMintPulse(current_24h, previous_24h, mint_quote_rate, melt_quote_rate, null, null, null);
			} catch (error) {
				const orchard_error = this.errorService.resolveError(this.logger, error, tag, {
					errord: OrchardErrorCode.MintDatabaseSelectError,
				});
				throw new OrchardApiError(orchard_error);
			}
		});
	}
}
