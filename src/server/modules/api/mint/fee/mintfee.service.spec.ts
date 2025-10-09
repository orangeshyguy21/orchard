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
	let mintfee_service: MintfeeService;
	let mint_service: jest.Mocked<MintService>;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintfeeService,
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: CashuMintDatabaseService, useValue: {getMintFees: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mintfee_service = module.get<MintfeeService>(MintfeeService);
		mint_service = module.get(MintService) as any;
		mint_db_service = module.get(CashuMintDatabaseService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(mintfee_service).toBeDefined();
	});

	it('returns OrchardMintFee[] on success', async () => {
		mint_db_service.getMintFees.mockResolvedValue([{unit: 'sat', fee: 1}] as any);
		const result = await mintfee_service.getMintFees('TAG', 1);
		expect(Array.isArray(result)).toBe(true);
		expect(result[0]).toBeInstanceOf(OrchardMintFee);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		const err = new Error('boom');
		mint_db_service.getMintFees.mockRejectedValue(err);
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseSelectError);
		await expect(mintfee_service.getMintFees('MY_TAG', 1)).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintDatabaseSelectError});
	});
});
