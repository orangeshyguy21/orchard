/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Native Dependencies */
import {MintService} from '@server/modules/api/mint/mint.service';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {MintfeeService} from './mintfee.service';
import {OrchardMintFee} from './mintfee.model';

describe('MintfeeService', () => {
	let mintFeeService: MintfeeService;
	let mintDbService: jest.Mocked<CashuMintDatabaseService>;
	let errorService: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintfeeService,
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: CashuMintDatabaseService, useValue: {getMintFees: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mintFeeService = module.get<MintfeeService>(MintfeeService);
		mintDbService = module.get(CashuMintDatabaseService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mintFeeService).toBeDefined();
	});

	it('returns OrchardMintFee[] on success', async () => {
		mintDbService.getMintFees.mockResolvedValue([{unit: 'sat', fee: 1}] as any);
		const result = await mintFeeService.getMintFees('TAG', 1);
		expect(Array.isArray(result)).toBe(true);
		expect(result[0]).toBeInstanceOf(OrchardMintFee);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		const err = new Error('boom');
		mintDbService.getMintFees.mockRejectedValue(err);
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintDatabaseSelectError});
		await expect(mintFeeService.getMintFees('MY_TAG', 1)).rejects.toBeInstanceOf(OrchardApiError);
		const calls = errorService.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintDatabaseSelectError});
	});
});
