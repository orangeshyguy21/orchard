import { Injectable } from '@nestjs/common';
/* Application Dependencies */
import { CashuMintDatabaseService } from '../../cashumintdb/cashumintdb.service';
import { CashuMintKeyset } from '../../cashumintdb/cashumintdb.types';
/* Internal Dependencies */
import { OrchardMintKeyset } from './mintkeyset.model';

@Injectable()
export class MintKeysetService {

  constructor(
    private cashuMintDatabaseService: CashuMintDatabaseService,
  ) {}

  async getMintKeysets() : Promise<OrchardMintKeyset[]> {
    const db = this.cashuMintDatabaseService.getMintDatabase();
    try {
      const cashu_keysets : CashuMintKeyset[] = await this.cashuMintDatabaseService.getMintKeysets(db);
      return cashu_keysets.map( ck => {
        const keyset = new OrchardMintKeyset();
        Object.assign(keyset, ck);
        if( 'active' in keyset ) !!keyset.active;
        return keyset;
      });
    } catch (err) {
      console.log('caught err', err);
    } finally {
      db.close();
    }
  }
}