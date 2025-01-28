import { Injectable } from '@nestjs/common';
/* Application Dependencies */
import { CashuService } from '../../cashu/cashu.service';
/* Application Models */
// import { Liabilities } from './liabilities.model';
import { Keyset } from './keyset.model';
import { CashuKeyset } from '../../cashu/cashu.types';


@Injectable()
export class KeysetService {

  constructor(
    private cashuService: CashuService,
  ) {}

  // async getKeysets() : Promise<Keyset[]> {
  //   const db = this.cashuService.getDatabase();
  //   try {
  //     const keysets : CashuKeyset[] = await this.cashuService.getKeysets(db);
  //     // const keysets = new Keyset();
  //     // liabilites.total_outstanding = balances[primary_balance_index]['s_issued - s_used'];
  //     return keysets.map( (keyset) => new Keyset() );
  //   } catch (err) {
  //     console.log('caught err', err);
  //   } finally {
  //     db.close();
  //   }
  // }

  async getKeysets() : Promise<Keyset[]> {
    const db = this.cashuService.getDatabase();
    try {
      const cashu_keysets : CashuKeyset[] = await this.cashuService.getKeysets(db);
      return cashu_keysets.map( ck => {
        const keyset = new Keyset();
        Object.assign(keyset, ck);
        if( 'active' in keyset ) !!keyset.active;
        // if( 'valid_from' in keyset ) keyset.valid_from = keyset.valid_from*1000;
        // if( 'valid_to' in keyset ) keyset.valid_to = keyset.valid_to*1000;
        // if( 'first_seen' in keyset ) keyset.first_seen = keyset.first_seen*1000;
        return keyset;
      });
    } catch (err) {
      console.log('caught err', err);
    } finally {
      db.close();
    }
  }
}


// @Field(type => GraphQLTimestamp)
// valid_from: number;

// @Field(type => GraphQLTimestamp)
// valid_to: number;

// @Field(type => GraphQLTimestamp)
// first_seen: number;



// /* Core Dependencies */
// import { Injectable } from '@nestjs/common';
// /* Application Dependencies */
// import { CashuService } from '../../cashu/cashu.service';
// /* Application Models */
// import { Liabilities } from './liabilities.model';
// import { CashuBalance } from '../../cashu/cashu.types';


// @Injectable()
// export class LiabilitiesService {

//   constructor(
//     private cashuService: CashuService,
//   ) {}

//   async getLiabilities() : Promise<Liabilities> {
//     const db = this.cashuService.getDatabase();
//     try {
//       const balances : CashuBalance[] = await this.cashuService.getBalances(db);
//       const primary_balance_index = 0;
//       const liabilites = new Liabilities();
//       liabilites.amount = balances[primary_balance_index]['s_issued - s_used'];
//       return liabilites;
//     } catch (err) {
//       console.log('caught err', err);
//     } finally {
//       db.close();
//     }
//   }

// }