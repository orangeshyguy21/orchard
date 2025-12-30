/* Application Dependencies */
import {OrchardError} from '@client/modules/error/types/error.types';
/* Shared Dependencies */
import {OrchardStatus} from '@shared/generated.types';

export type OrchardRes<T> = {
	data: T;
	errors?: {message: string; extensions: {code: number; details?: string}}[];
};

export type OrchardWsRes<T> = {
	type: string;
	payload?: {
		data: T;
		errors?: OrchardError[];
	};
	id?: string;
};

export type StatusResponse = {
	status: OrchardStatus;
};
