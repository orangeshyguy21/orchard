/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintService} from './mint.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';

describe('MintService', () => {
	let mint_service: MintService;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintService,
				{provide: CashuMintDatabaseService, useValue: {getMintDatabase: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_service = module.get<MintService>(MintService);
		mint_db_service = module.get(CashuMintDatabaseService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(mint_service).toBeDefined();
	});

	it('withDbClient: sqlite closes db and returns action result', async () => {
		const close = jest.fn();
		mint_db_service.getMintDatabase.mockResolvedValue({type: 'sqlite', database: {close}} as any);
		const result = await mint_service.withDbClient(async () => 42 as any);
		expect(result).toBe(42);
		expect(close).toHaveBeenCalled();
	});

	it('withDbClient: postgres connects and ends', async () => {
		const connect = jest.fn();
		const end = jest.fn();
		mint_db_service.getMintDatabase.mockResolvedValue({type: 'postgres', database: {connect, end}} as any);
		const result = await mint_service.withDbClient(async () => 'ok' as any);
		expect(result).toBe('ok');
		expect(connect).toHaveBeenCalled();
		expect(end).toHaveBeenCalled();
	});

	it('withDbClient: wraps connection errors and throws OrchardApiError', async () => {
		mint_db_service.getMintDatabase.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseConnectionError);
		await expect(mint_service.withDbClient(async () => 0 as any)).rejects.toBeInstanceOf(OrchardApiError);
	});
});
