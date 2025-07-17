import {GraphQLError} from 'graphql';
import {OrchardErrorCode, OrchardErrorMessages} from '@server/modules/error/error.types';

export class OrchardApiError extends GraphQLError {
	constructor(code: OrchardErrorCode) {
		super(OrchardErrorMessages[code], {
			extensions: {
				code: code,
			},
		});
	}
}
