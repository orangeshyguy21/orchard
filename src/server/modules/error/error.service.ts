/* Core Dependencies */
import {Injectable, Logger} from '@nestjs/common';
/* Local Dependencies */
import {OrchardErrorCode, OrchardErrorMessages} from './error.types';

@Injectable()
export class ErrorService {
	constructor() {}

	public resolveError(logger: Logger, error: any, msg: string, {errord}: {errord: OrchardErrorCode}) {
		logger.error(msg);
		logger.debug(`${msg}: ${error}`);
		let error_code = errord;
		const matching_key = Object.keys(OrchardErrorMessages).find((key) => !isNaN(Number(key)) && error === Number(key));
		if (matching_key) error_code = Number(matching_key);
		return error_code;
	}
}
