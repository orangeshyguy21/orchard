import {OrchardRes} from '@client/modules/api/types/api.types';

export class OrchardErrors {
	public errors: OrchardError[];

	constructor(errors: OrchardRes<any>['errors']) {
		this.errors = errors
			? errors.map((error) => new OrchardError(error.message, error.extensions.code, error.extensions?.details ?? undefined))
			: [];
	}
}

class OrchardError {
	public message: string;
	public code: number;
	public details?: string;

	constructor(message: string, code: number, details?: string) {
		this.message = message;
		this.code = code;
		this.details = details;
	}

	public getFullError(): string {
		if (!this.details) return `${this.message} : ${this.code}`;
		return `${this.message} : ${this.code}<br><br>${this.details}`;
	}
}
