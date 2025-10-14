/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import {Logger} from '@nestjs/common';
/* Local Dependencies */
import {ErrorService} from './error.service';
import {OrchardErrorCode} from './error.types';

describe('ErrorService', () => {
	let error_service: ErrorService;
	let logger: jest.Mocked<Logger>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [ErrorService],
		}).compile();

		error_service = module.get<ErrorService>(ErrorService);
		logger = {
			log: jest.fn(),
			error: jest.fn(),
			warn: jest.fn(),
			debug: jest.fn(),
			verbose: jest.fn(),
			setContext: jest.fn(),
		} as any;
	});

	it('should be defined', () => {
		expect(error_service).toBeDefined();
	});

	it('returns provided default code and logs', () => {
		const code = error_service.resolveError(logger, new Error('x'), 'TAG', {errord: OrchardErrorCode.MintSupportError});
		expect(code).toBe(OrchardErrorCode.MintSupportError);
		expect(logger.error).toHaveBeenCalledWith('TAG');
		expect(logger.debug).toHaveBeenCalled();
	});

	it('maps numeric error equal to known code', () => {
		const code = error_service.resolveError(logger, OrchardErrorCode.AiError, 'TAG', {errord: OrchardErrorCode.MintSupportError});
		expect(code).toBe(OrchardErrorCode.AiError);
	});

	it('ignores non-matching numbers and keeps default', () => {
		const code = error_service.resolveError(logger, 999999, 'TAG', {errord: OrchardErrorCode.MintSupportError});
		expect(code).toBe(OrchardErrorCode.MintSupportError);
	});
});
