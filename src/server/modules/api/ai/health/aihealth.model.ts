/* Core Dependencies */
import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType({description: 'AI service health status'})
export class OrchardAiHealth {
	@Field({description: 'Whether the AI service is healthy'})
	status: boolean;

	@Field(() => String, {nullable: true, description: 'Diagnostic message if unhealthy'})
	message: string | null;

	@Field({description: 'AI service vendor name'})
	vendor: string;

	constructor(data: {status: boolean; message: string | null; vendor: string}) {
		this.status = data.status;
		this.message = data.message;
		this.vendor = data.vendor;
	}
}
