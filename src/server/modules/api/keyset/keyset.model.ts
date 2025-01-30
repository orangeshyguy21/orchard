/* Core Dependencies */
import { Field, Int, ID, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '../../graphql/types/unixtimestamp';

@ObjectType()
export class Keyset {
  @Field(type => ID)
  id: string;

  @Field()
  derivation_path: string;

  @Field()
  seed: string;

  @Field(type => UnixTimestamp)
  valid_from: number;

  @Field(type => UnixTimestamp)
  valid_to: number;

  @Field(type => UnixTimestamp)
  first_seen: number;

  @Field()
  active: boolean;

  @Field()
  version: string;

  @Field()
  unit: string;

  @Field({ nullable: true })
  encrypted_seed: string;

  @Field({ nullable: true })
  seed_encryption_method: string;

  @Field(type => Int)
  input_fee_ppk: number;
}
