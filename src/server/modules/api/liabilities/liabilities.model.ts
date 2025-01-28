/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Liabilities {

  @Field(type => Int)
  total_outstanding: number;

  @Field(type => Int)
  total_issued: number;

  @Field(type => Int)
  total_redeemed: number;

}