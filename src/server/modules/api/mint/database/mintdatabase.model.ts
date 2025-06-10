/* Core Dependencies */
import { Field, ObjectType } from '@nestjs/graphql';
/* Application Dependencies */
import { Base64 } from '@server/modules/graphql/scalars/base64.scalar';

@ObjectType()
export class OrchardMintDatabaseBackup {

	@Field(type => Base64)
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
