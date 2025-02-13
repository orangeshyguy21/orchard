/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintDatabaseService } from '@server/modules/cashumintdb/cashumintdb.service';
import { CashuMintMeltQuote } from '@server/modules/cashumintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintMeltQuote } from './mintmeltquote.model';

@Injectable()
export class MintMeltQuoteService {

  constructor(
    private cashuMintDatabaseService: CashuMintDatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getMintMeltQuotes() : Promise<OrchardMintMeltQuote[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_melt_quotes : CashuMintMeltQuote[] = await this.cashuMintDatabaseService.getMintMeltQuotes(db);
      return cashu_melt_quotes.map( cmq => new OrchardMintMeltQuote(cmq));
    } catch (error) {
      this.logger.error('Error getting melt quotes from mint database', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }
}