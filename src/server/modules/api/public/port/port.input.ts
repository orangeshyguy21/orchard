/* Core Dependencies */
import {Field, InputType, Int} from '@nestjs/graphql';

@InputType({description: 'Input for checking port reachability'})
export class PublicPortInput {
	@Field(() => String, {description: 'Hostname or IP address to check'})
	host: string;

	@Field(() => Int, {description: 'Port number to check'})
	port: number;
}
