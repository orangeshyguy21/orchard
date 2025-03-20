import { OrchardRes } from "@client/modules/api/types/api.types";

export class OrchardErr {

    public errors: string[];

	constructor(errors:OrchardRes<any>['errors']) {
		this.errors = errors ? errors.map((error) => error.message) : [];
	}
}