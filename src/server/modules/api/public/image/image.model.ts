/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'Public image data'})
export class OrchardPublicImage {
	@Field(() => String, {nullable: true, description: 'Base64-encoded image data URI'})
	data: string;

	@Field({description: 'MIME type of the image'})
	type: string;

	constructor(data: Buffer, type: string) {
		this.data = data ? `data:${type};base64,${data.toString('base64')}` : null;
		this.type = type;
	}
}
