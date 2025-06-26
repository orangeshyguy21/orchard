/* Core Dependencies */
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AuthenticationInput {
	@Field()
	password: string;
}
