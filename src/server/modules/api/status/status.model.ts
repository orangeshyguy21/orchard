/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class OrchardStatus {
	@Field()
	title: string;

	@Field()
	online: boolean;

	constructor(status: OrchardStatus) {
		this.title = status.title;
		this.online = status.online;
	}
}
