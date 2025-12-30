/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintPromiseService} from './mintpromise.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
import {OrchardMintPromiseGroup} from './mintpromise.model';

describe('MintPromiseService', () => {
	let mintPromiseService: MintPromiseService;
	let mintDbService: jest.Mocked<CashuMintDatabaseService>;
	let errorService: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintPromiseService,
				{provide: CashuMintDatabaseService, useValue: {getMintPromiseGroups: jest.fn()}},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mintPromiseService = module.get<MintPromiseService>(MintPromiseService);
		mintDbService = module.get(CashuMintDatabaseService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mintPromiseService).toBeDefined();
	});

	it('getMintPromiseGroups returns OrchardMintPromiseGroup[]', async () => {
		mintDbService.getMintPromiseGroups.mockResolvedValue([{amounts: [[1]]}] as any);
		const result = await mintPromiseService.getMintPromiseGroups('TAG', {} as any);
		expect(result[0]).toBeInstanceOf(OrchardMintPromiseGroup);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mintDbService.getMintPromiseGroups.mockRejectedValue(new Error('boom'));
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintDatabaseSelectError});
		await expect(mintPromiseService.getMintPromiseGroups('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
