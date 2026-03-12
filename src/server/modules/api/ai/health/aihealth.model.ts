/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardAiHealth {
	@Field()
	status: boolean;

	@Field(() => String, {nullable: true})
	message: string | null;

	@Field()
	vendor: string;

	constructor(data: {status: boolean; message: string | null; vendor: string}) {
		this.status = data.status;
		this.message = data.message;
		this.vendor = data.vendor;
	}
}
