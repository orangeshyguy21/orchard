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
import {MintDatabaseService} from './mintdatabase.service';
import {OrchardMintDatabaseBackup, OrchardMintDatabaseRestore} from './mintdatabase.model';

describe('MintDatabaseService', () => {
	let mint_database_service: MintDatabaseService;
	let mint_service: jest.Mocked<MintService>;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintDatabaseService,
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: CashuMintDatabaseService, useValue: {createBackup: jest.fn(), restoreBackup: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_database_service = module.get<MintDatabaseService>(MintDatabaseService);
		mint_service = module.get(MintService) as any;
		mint_db_service = module.get(CashuMintDatabaseService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(mint_database_service).toBeDefined();
	});

	it('createMintDatabaseBackup returns OrchardMintDatabaseBackup', async () => {
		mint_db_service.createBackup.mockResolvedValue(Buffer.from('file'));
		const result = await mint_database_service.createMintDatabaseBackup('TAG');
		expect(result).toBeInstanceOf(OrchardMintDatabaseBackup);
		expect(result.filebase64).toBe(Buffer.from('file').toString('base64'));
	});

	it('restoreMintDatabaseBackup returns OrchardMintDatabaseRestore', async () => {
		mint_db_service.restoreBackup.mockResolvedValue(undefined as any);
		const result = await mint_database_service.restoreMintDatabaseBackup('TAG', 'Zm8=');
		expect(result).toBeInstanceOf(OrchardMintDatabaseRestore);
		expect(result.success).toBe(true);
	});

	it('wraps errors via resolveError and throws OrchardApiError on backup failure', async () => {
		mint_db_service.createBackup.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseBackupError);
		await expect(mint_database_service.createMintDatabaseBackup('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
