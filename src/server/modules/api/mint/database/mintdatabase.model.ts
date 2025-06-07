/* Core Dependencies */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrchardMintDatabaseBackup {

	@Field()
	filebase64: string;

	constructor(filebase64: string) {
		this.filebase64 = filebase64;
	}
}

@ObjectType()
export class OrchardMintDatabaseRestore {

	@Field()
	success: boolean;

	constructor(success: boolean) {
		this.success = success;
	}
}
