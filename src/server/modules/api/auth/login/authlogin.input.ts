/* Core Dependencies */
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class AuthLoginInput {
	@Field()
	password: string;
}
