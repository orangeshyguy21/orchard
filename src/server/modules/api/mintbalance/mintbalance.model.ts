/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrchardMintBalance {

  @Field(type => Int)
  total_outstanding: number;

  @Field(type => Int)
  total_issued: number;

  @Field(type => Int)
  total_redeemed: number;

}

  // public setTotalOutstanding(value: number) {
  //   this.total_outstanding = value;
  // }

// const primary_balance_index = 0;
// const balance = new OrchardMintBalance();
// balance.total_outstanding = balances[primary_balance_index]['s_issued - s_used'];