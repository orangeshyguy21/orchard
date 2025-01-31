/* Core Dependencies */
import { Field, Int, ID, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { UnixTimestamp } from '../../graphql/types/unixtimestamp';
import { CashuMintKeyset } from '../../cashumintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintKeyset {
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

  constructor(cashu_keyset:CashuMintKeyset) {
    this.id = cashu_keyset.id;
    this.derivation_path = cashu_keyset.derivation_path;
    this.seed = cashu_keyset.seed;
    this.valid_from = cashu_keyset.valid_from;
    this.valid_to = cashu_keyset.valid_to;
    this.first_seen = cashu_keyset.first_seen;
    this.active = !!cashu_keyset.active;
    this.version = cashu_keyset.version;
    this.unit = cashu_keyset.unit;
    this.encrypted_seed = cashu_keyset.encrypted_seed;
    this.seed_encryption_method = cashu_keyset.seed_encryption_method;
    this.input_fee_ppk = cashu_keyset.input_fee_ppk;
  }
}
