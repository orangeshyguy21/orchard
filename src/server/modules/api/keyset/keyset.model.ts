/* Core Dependencies */
import { Field, Int, ID, GraphQLTimestamp, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Keyset {
  @Field(type => ID)
  id: string;

  @Field()
  derivation_path: string;

  @Field()
  seed: string;

  // @Field(type => GraphQLTimestamp)
  // valid_from: number;

  // @Field(type => GraphQLTimestamp)
  // valid_to: number;

  // @Field(type => GraphQLTimestamp)
  // first_seen: number;

  @Field(type => Int)
  valid_from: number;

  @Field(type => Int)
  valid_to: number;

  @Field(type => Int)
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





// export type CashuKeyset = {
//     id: string;
//     derivation_path: string;
//     seed: string;
//     valid_from: number;
//     valid_to: number;
//     first_seen: number;
//     active: number;
//     version: string;
//     unit: string;
//     encrypted_seed: string|null;
//     seed_encryption_method: string|null;
//     input_fee_ppk: number;
//   }

// id = 00c1a4b0369bb8b6
// derivation_path = m/0'/0'/0'
//            seed = smalldoublegrouparrow
//      valid_from = 1728878493
//        valid_to = 1728878493
//      first_seen = 1728878493
//          active = 1
//         version = 0.16.0
//            unit = sat
//  encrypted_seed = 
// seed_encryption_method = 
//   input_fee_ppk = 0
