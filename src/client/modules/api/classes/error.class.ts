import { OrchardRes } from "@client/modules/api/types/api.types";

export class OrchardErrors {

	public errors: { message: string, code: number }[];

	constructor(errors:OrchardRes<any>['errors']) {
		this.errors = errors ? errors.map((error) => ({ message: error.message, code: error.extensions.code })) : [];
	}
}