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

  constructor(total_outstanding?: number, total_issued?: number, total_redeemed?: number) {
    this.total_outstanding = total_outstanding;
    this.total_issued = total_issued;
    this.total_redeemed = total_redeemed;
  }
}