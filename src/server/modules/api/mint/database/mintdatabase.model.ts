/* Core Dependencies */
import { Field, Int, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { CashuMintDatabaseVersion } from '@server/modules/cashu/mintdb/cashumintdb.types';

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

@ObjectType()
export class OrchardMintDatabaseBackup {
    
    @Field()
    filename: string;

	@Field()
	encoded_data: string;

	constructor(filename: string, encoded_data: string) {
		this.filename = filename;
		this.encoded_data = encoded_data;
	}
}