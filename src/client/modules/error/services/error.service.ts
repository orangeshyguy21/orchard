import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ErrorService {
	public resolve_errors: any[] = [];

	constructor() {}
}
