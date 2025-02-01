/* Core Dependencies */
import { Injectable, Inject } from '@nestjs/common';
/* Vendor Dependencies */
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
/* Application Dependencies */
import { CashuMintDatabaseService } from '../../cashumintdb/cashumintdb.service';
import { CashuMintDatabaseVersion } from '../../cashumintdb/cashumintdb.types';
/* Internal Dependencies */
import { OrchardMintDatabase } from './mintdatabase.model';

@Injectable()
export class MintDatabaseService {

  constructor(
    private cashuMintDatabaseService: CashuMintDatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getMintDatabases() : Promise<OrchardMintDatabase[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_databases : CashuMintDatabaseVersion[] = await this.cashuMintDatabaseService.getMintDatabaseVersions(db);
      return cashu_databases.map( cd => new OrchardMintDatabase(cd));
    } catch (error) {
      this.logger.error('Error getting mint db versions from database', { error });
      throw new Error(error);
    } finally {
      db.close();
    }
  }
}