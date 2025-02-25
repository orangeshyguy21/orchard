/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { CashuMintBalance } from '@server/modules/cashumintdb/cashumintdb.types';

// @ObjectType()
// export class OrchardMintBalance {

//   @Field(type => Int)
//   total_outstanding: number;

//   @Field(type => Int)
//   total_issued: number;

//   @Field(type => Int)
//   total_redeemed: number;

//   constructor(total_outstanding?: number, total_issued?: number, total_redeemed?: number) {
//     this.total_outstanding = total_outstanding;
//     this.total_issued = total_issued;
//     this.total_redeemed = total_redeemed;
//   }
// }

@ObjectType()
export class OrchardMintBalance {

  @Field()
  keyset: string;

  @Field(type => Int)
  balance: number;

  constructor(cashu_mint_balance: CashuMintBalance) {
    this.keyset = cashu_mint_balance.keyset;
    this.balance = cashu_mint_balance.balance;
  }
}