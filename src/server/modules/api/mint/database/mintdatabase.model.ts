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
	filebase64: string;

	constructor(filebase64: string) {
		this.filebase64 = filebase64;
	}
}