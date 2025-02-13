/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { CashuMintDatabaseVersion } from '@server/modules/cashumintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintDatabase {

  @Field()
  db: string;

  @Field(type => Int)
  version: number;

  constructor(cashu_database:CashuMintDatabaseVersion) {
    this.db = cashu_database.db;
    this.version = cashu_database.version;
  }
}