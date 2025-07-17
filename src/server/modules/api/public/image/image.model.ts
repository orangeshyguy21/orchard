/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardPublicImage {
	@Field(() => String, {nullable: true})
	data: string;

	@Field()
	type: string;

	constructor(data: Buffer, type: string) {
		this.data = data ? `data:${type};base64,${data.toString('base64')}` : null;
		this.type = type;
	}
}
