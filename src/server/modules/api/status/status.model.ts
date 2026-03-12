/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'Application status information'})
export class OrchardStatus {
	@Field({description: 'Application title'})
	title: string;

	@Field({description: 'Whether the application is online'})
	online: boolean;

	constructor(status: OrchardStatus) {
		this.title = status.title;
		this.online = status.online;
	}
}
