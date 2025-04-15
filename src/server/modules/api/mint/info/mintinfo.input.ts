/* Core Dependencies */
import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class MintNameUpdateInput {
	@Field()
	name: string;
}

@InputType()
export class MintIconUpdateInput {
	@Field()
	icon_url: string;
}

@InputType()
export class MintDescriptionUpdateInput {
	@Field()
	description: string;
}

@InputType()
export class MintMotdUpdateInput {
	@Field()
	motd: string;
}

@InputType()
export class MintUrlUpdateInput {
	@Field()
	url: string;
}

@InputType()
export class MintContactUpdateInput {
	@Field()
	method: string;

	@Field()
	info: string;
}