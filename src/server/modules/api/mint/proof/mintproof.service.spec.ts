/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {MintProofService} from './mintproof.service';
import {OrchardMintProofGroup, OrchardMintProofGroupStats} from './mintproof.model';

describe('MintProofService', () => {
	let mint_proof_service: MintProofService;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let mint_service: jest.Mocked<MintService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintProofService,
				{provide: CashuMintDatabaseService, useValue: {getMintProofGroups: jest.fn()}},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_proof_service = module.get<MintProofService>(MintProofService);
		mint_db_service = module.get(CashuMintDatabaseService);
		mint_service = module.get(MintService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mint_proof_service).toBeDefined();
	});

	it('getMintProofGroups returns OrchardMintProofGroup[]', async () => {
		mint_db_service.getMintProofGroups.mockResolvedValue([{amounts: [[]]}] as any);
		const result = await mint_proof_service.getMintProofGroups('TAG', {} as any);
		expect(result[0]).toBeInstanceOf(OrchardMintProofGroup);
	});

	it('getMintProofGroupStats returns median count', async () => {
		mint_db_service.getMintProofGroups.mockResolvedValue([{amounts: [[1, 2, 3]]}] as any);
		const result = await mint_proof_service.getMintProofGroupStats('TAG', 'sat' as any);
		expect(result).toEqual({median: 3});
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mint_db_service.getMintProofGroups.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseSelectError);
		await expect(mint_proof_service.getMintProofGroups('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintDatabaseSelectError});
	});
});
