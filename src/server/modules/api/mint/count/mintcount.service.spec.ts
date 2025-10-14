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
import {MintCountService} from './mintcount.service';
import {OrchardMintCount} from './mintcount.model';

describe('MintCountService', () => {
	let mint_count_service: MintCountService;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let _mint_service: jest.Mocked<MintService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintCountService,
				{
					provide: CashuMintDatabaseService,
					useValue: {
						getMintCountMintQuotes: jest.fn(),
						getMintCountMeltQuotes: jest.fn(),
						getMintCountProofGroups: jest.fn(),
						getMintCountPromiseGroups: jest.fn(),
					},
				},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_count_service = module.get<MintCountService>(MintCountService);
		mint_db_service = module.get(CashuMintDatabaseService);
		_mint_service = module.get(MintService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mint_count_service).toBeDefined();
	});

	it('getMintCountMintQuotes returns OrchardMintCount', async () => {
		mint_db_service.getMintCountMintQuotes.mockResolvedValue(5 as any);
		const result = await mint_count_service.getMintCountMintQuotes('TAG', {} as any);
		expect(result).toBeInstanceOf(OrchardMintCount);
		expect(result.count).toBe(5);
	});

	it('getMintCountMeltQuotes returns OrchardMintCount', async () => {
		mint_db_service.getMintCountMeltQuotes.mockResolvedValue(2 as any);
		const result = await mint_count_service.getMintCountMeltQuotes('TAG', {} as any);
		expect(result.count).toBe(2);
	});

	it('getMintCountProofGroups returns OrchardMintCount', async () => {
		mint_db_service.getMintCountProofGroups.mockResolvedValue(3 as any);
		const result = await mint_count_service.getMintCountProofGroups('TAG', {} as any);
		expect(result.count).toBe(3);
	});

	it('getMintCountPromiseGroups returns OrchardMintCount', async () => {
		mint_db_service.getMintCountPromiseGroups.mockResolvedValue(4 as any);
		const result = await mint_count_service.getMintCountPromiseGroups('TAG', {} as any);
		expect(result.count).toBe(4);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mint_db_service.getMintCountMintQuotes.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseSelectError);
		await expect(mint_count_service.getMintCountMintQuotes('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
