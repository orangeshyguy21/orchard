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
	let mint_promise_service: MintPromiseService;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let mint_service: jest.Mocked<MintService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintPromiseService,
				{provide: CashuMintDatabaseService, useValue: {getMintPromiseGroups: jest.fn()}},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_promise_service = module.get<MintPromiseService>(MintPromiseService);
		mint_db_service = module.get(CashuMintDatabaseService);
		mint_service = module.get(MintService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mint_promise_service).toBeDefined();
	});

	it('getMintPromiseGroups returns OrchardMintPromiseGroup[]', async () => {
		mint_db_service.getMintPromiseGroups.mockResolvedValue([{amounts: [[1]]}] as any);
		const result = await mint_promise_service.getMintPromiseGroups('TAG', {} as any);
		expect(result[0]).toBeInstanceOf(OrchardMintPromiseGroup);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mint_db_service.getMintPromiseGroups.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseSelectError);
		await expect(mint_promise_service.getMintPromiseGroups('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
