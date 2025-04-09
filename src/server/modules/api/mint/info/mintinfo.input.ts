/* Core Dependencies */
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UpdateMintNameInput {
	@Field()
	name: string;
}

@InputType()
export class UpdateMintIconInput {
	@Field()
	icon_url: string;
}

@InputType()
export class UpdateMintDescriptionInput {
	@Field()
	description: string;
}

@InputType()
export class UpdateMotdInput {
	@Field()
	motd: string;
}

@InputType()
export class UpdateUrlInput {
	@Field()
	url: string;
}

@InputType()
export class UpdateContactInput {
	@Field()
	method: string;

	@Field()
	info: string;
}