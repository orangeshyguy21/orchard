/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintDatabaseService } from '../../cashumintdb/cashumintdb.service';
import { CashuMintMintQuote } from '../../cashumintdb/cashumintdb.types';
/* Local Dependencies */
import { OrchardMintMintQuote } from './mintmintquote.model';

@Injectable()
export class MintMintQuoteService {

  constructor(
    private cashuMintDatabaseService: CashuMintDatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getMintMintQuotes() : Promise<OrchardMintMintQuote[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_mint_quotes : CashuMintMintQuote[] = await this.cashuMintDatabaseService.getMintMintQuotes(db);
      return cashu_mint_quotes.map( cmq => new OrchardMintMintQuote(cmq));
    } catch (error) {
      this.logger.error('Error getting mint quotes from mint database', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }
}