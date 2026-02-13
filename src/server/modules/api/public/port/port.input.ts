/* Core Dependencies */
import {Field, InputType, Int} from '@nestjs/graphql';

@InputType()
export class PublicPortInput {
	@Field(() => String)
	host: string;

	@Field(() => Int)
	port: number;
}
