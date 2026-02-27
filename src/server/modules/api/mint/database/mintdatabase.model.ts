/* Core Dependencies */
import {Field, Float, ObjectType} from '@nestjs/graphql';
/* Application Dependencies */
import {Base64} from '@server/modules/graphql/scalars/base64.scalar';
/* Native Dependencies */
import {CashuMintDatabaseInfo} from '@server/modules/cashu/mintdb/cashumintdb.types';

@ObjectType()
export class OrchardMintDatabaseBackup {
	@Field(() => Base64)
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

@ObjectType()
export class OrchardMintDatabaseInfo {
	@Field(() => Float)
	size: number;

	@Field()
	type: string;

	constructor(info: CashuMintDatabaseInfo) {
		this.size = info.size;
		this.type = info.type;
	}
}
