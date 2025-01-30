import { Injectable } from '@nestjs/common';
/* Application Dependencies */
import { CashuService } from '../../cashu/cashu.service';
/* Application Models */
import { Keyset } from './keyset.model';
import { CashuKeyset } from '../../cashu/cashu.types';


@Injectable()
export class KeysetService {

  constructor(
    private cashuService: CashuService,
  ) {}

  async getKeysets() : Promise<Keyset[]> {
    const db = this.cashuService.getDatabase();
    try {
      const cashu_keysets : CashuKeyset[] = await this.cashuService.getKeysets(db);
      return cashu_keysets.map( ck => {
        const keyset = new Keyset();
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