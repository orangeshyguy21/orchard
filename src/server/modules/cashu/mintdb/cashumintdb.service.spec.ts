/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Local Dependencies */
import {CashuMintDatabaseService} from './cashumintdb.service';
import {ConfigService} from '@nestjs/config';
import {NutshellService} from '@server/modules/cashu/nutshell/nutshell.service';
import {CdkService} from '@server/modules/cashu/cdk/cdk.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {MintDatabaseType} from './cashumintdb.enums';
import * as child_process from 'child_process';
import {promises as fs_promises} from 'fs';

jest.mock('pg', () => ({
	Client: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('better-sqlite3', () => {
	return jest.fn().mockImplementation(() => ({
		pragma: jest.fn(),
		backup: jest.fn(),
		close: jest.fn(),
	}));
});

jest.mock('child_process', () => ({
	spawn: jest.fn(),
}));

describe('CashuMintDatabaseService', () => {
	let cashu_mint_database_service: CashuMintDatabaseService;
	let config_service: jest.Mocked<ConfigService>;
	let nutshell_service: jest.Mocked<NutshellService>;
	let cdk_service: jest.Mocked<CdkService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CashuMintDatabaseService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: NutshellService, useValue: {}},
				{provide: CdkService, useValue: {}},
			],
		}).compile();

		cashu_mint_database_service = module.get<CashuMintDatabaseService>(CashuMintDatabaseService);
		config_service = module.get(ConfigService) as any;
		nutshell_service = module.get(NutshellService) as any;
		cdk_service = module.get(CdkService) as any;
	});

	it('should be defined', () => {
		expect(cashu_mint_database_service).toBeDefined();
	});

	it('getMintDatabase returns postgres client without connecting', async () => {
		config_service.get.mockImplementation((k: string) => {
			if (k === 'cashu.database_type') return 'postgres';
			if (k === 'cashu.database') return 'postgres://user:pass@localhost:5432/db';
			return undefined as any;
		});
		await cashu_mint_database_service.onModuleInit();
		const db = await cashu_mint_database_service.getMintDatabase();
		expect(db.type).toBeDefined();
	});

	it('onModuleInit sets type and database from config', async () => {
		config_service.get.mockImplementation((k: string) => {
			if (k === 'cashu.type') return 'nutshell';
			if (k === 'cashu.database') return '/tmp/test.db';
			return undefined as any;
		});
		await cashu_mint_database_service.onModuleInit();
		// Indirectly verify via method dispatch that type/database were set
		(nutshell_service.getMintBalances as any) = jest.fn().mockResolvedValue([{keyset: 'k', balance: 1}]);
		const db = {type: MintDatabaseType.sqlite, database: {}} as any;
		const out = await cashu_mint_database_service.getMintBalances(db);
		expect(out[0].balance).toBe(1);
	});

	it('getMintDatabase returns sqlite client with pragma and readonly', async () => {
		const BetterSqlite3 = require('better-sqlite3');
		config_service.get.mockImplementation((k: string) => {
			if (k === 'cashu.database_type') return 'sqlite';
			if (k === 'cashu.database') return '/tmp/sqlite.db';
			return undefined as any;
		});
		await cashu_mint_database_service.onModuleInit();
		const db = await cashu_mint_database_service.getMintDatabase();
		expect(db.type).toBe(MintDatabaseType.sqlite);
		expect((db as any).database.pragma).toHaveBeenCalledWith('busy_timeout = 5000');
	});

	it('getMintDatabase throws MintDatabaseConnectionError on constructor failure', async () => {
		const BetterSqlite3 = require('better-sqlite3');
		(BetterSqlite3 as jest.Mock).mockImplementationOnce(() => {
			throw new Error('boom');
		});
		config_service.get.mockImplementation((k: string) => {
			if (k === 'cashu.database_type') return 'sqlite';
			if (k === 'cashu.database') return '/tmp/sqlite.db';
			return undefined as any;
		});
		await cashu_mint_database_service.onModuleInit();
		await expect(cashu_mint_database_service.getMintDatabase()).rejects.toBe(OrchardErrorCode.MintDatabaseConnectionError);
	});

	it('delegates by type for balances', async () => {
		(nutshell_service.getMintBalances as any) = jest.fn().mockResolvedValue([{keyset: 'k', balance: 1}]);
		(cdk_service.getMintBalances as any) = jest.fn().mockResolvedValue([{keyset: 'k', balance: 2}]);
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'nutshell' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		const out1 = await cashu_mint_database_service.getMintBalances({} as any);
		expect(out1[0].balance).toBe(1);
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'cdk' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		const out2 = await cashu_mint_database_service.getMintBalances({} as any);
		expect(out2[0].balance).toBe(2);
	});

	it('getMintFees delegates for nutshell and errors for cdk', async () => {
		(nutshell_service.getMintFees as any) = jest.fn().mockResolvedValue([]);
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'nutshell' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		await expect(cashu_mint_database_service.getMintFees({} as any)).resolves.toEqual([]);
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'cdk' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		await expect(cashu_mint_database_service.getMintFees({} as any)).rejects.toBe(OrchardErrorCode.MintSupportError);
	});

	it('delegates remaining getters to correct services', async () => {
		const client = {} as any;
		const args = {a: 1} as any;
		const nutshell_map: Array<[keyof CashuMintDatabaseService, keyof NutshellService]> = [
			['getMintBalancesIssued', 'getMintBalancesIssued'],
			['getMintBalancesRedeemed', 'getMintBalancesRedeemed'],
			['getMintKeysets', 'getMintKeysets'],
			['getMintMintQuotes', 'getMintMintQuotes'],
			['getMintMeltQuotes', 'getMintMeltQuotes'],
			['getMintProofGroups', 'getMintProofGroups'],
			['getMintPromiseGroups', 'getMintPromiseGroups'],
			['getMintCountMintQuotes', 'getMintCountMintQuotes'],
			['getMintCountMeltQuotes', 'getMintCountMeltQuotes'],
			['getMintCountProofGroups', 'getMintCountProofGroups'],
			['getMintCountPromiseGroups', 'getMintCountPromiseGroups'],
			['getMintKeysetProofCounts', 'getMintKeysetProofCounts'],
			['getMintAnalyticsBalances', 'getMintAnalyticsBalances'],
			['getMintAnalyticsMints', 'getMintAnalyticsMints'],
			['getMintAnalyticsMelts', 'getMintAnalyticsMelts'],
			['getMintAnalyticsSwaps', 'getMintAnalyticsSwaps'],
			['getMintAnalyticsFees', 'getMintAnalyticsFees'],
		];

		// Nutshell
		nutshell_map.forEach(([svc_method, n_method]) => {
			(nutshell_service[n_method as any] as any) = jest.fn().mockResolvedValue('nutshell');
		});
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'nutshell' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		for (const [svc_method, n_method] of nutshell_map) {
			const result = await (cashu_mint_database_service[svc_method as any] as any)(client, args);
			expect(nutshell_service[n_method as any]).toHaveBeenCalled();
			expect(result).toBe('nutshell');
		}

		// CDK
		nutshell_map.forEach(([_, n_method]) => {
			(nutshell_service[n_method as any] as any) = jest.fn();
		});
		const cdk_map: Array<[keyof CashuMintDatabaseService, keyof CdkService]> = [
			['getMintBalancesIssued', 'getMintBalancesIssued'],
			['getMintBalancesRedeemed', 'getMintBalancesRedeemed'],
			['getMintKeysets', 'getMintKeysets'],
			['getMintMintQuotes', 'getMintMintQuotes'],
			['getMintMeltQuotes', 'getMintMeltQuotes'],
			['getMintProofGroups', 'getMintProofGroups'],
			['getMintPromiseGroups', 'getMintPromiseGroups'],
			['getMintCountMintQuotes', 'getMintCountMintQuotes'],
			['getMintCountMeltQuotes', 'getMintCountMeltQuotes'],
			['getMintCountProofGroups', 'getMintCountProofGroups'],
			['getMintCountPromiseGroups', 'getMintCountPromiseGroups'],
			['getMintKeysetProofCounts', 'getMintKeysetProofCounts'],
			['getMintAnalyticsBalances', 'getMintAnalyticsBalances'],
			['getMintAnalyticsMints', 'getMintAnalyticsMints'],
			['getMintAnalyticsMelts', 'getMintAnalyticsMelts'],
			['getMintAnalyticsSwaps', 'getMintAnalyticsSwaps'],
		];
		cdk_map.forEach(([_, c_method]) => {
			(cdk_service[c_method as any] as any) = jest.fn().mockResolvedValue('cdk');
		});
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'cdk' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		for (const [svc_method, c_method] of cdk_map) {
			const result = await (cashu_mint_database_service[svc_method as any] as any)(client, args);
			expect(cdk_service[c_method as any]).toHaveBeenCalled();
			expect(result).toBe('cdk');
		}
	});

	it('getMintAnalyticsFees returns [] for cdk', async () => {
		config_service.get.mockImplementation((k: string) => (k === 'cashu.type' ? 'cdk' : 'x'));
		await cashu_mint_database_service.onModuleInit();
		const out = await cashu_mint_database_service.getMintAnalyticsFees({} as any);
		expect(out).toEqual([]);
	});

	describe('backups and restores', () => {
		beforeEach(() => {
			jest.restoreAllMocks();
		});

		it('createBackup dispatches by client.type', async () => {
			const spy_sqlite = jest
				.spyOn<any, any>(cashu_mint_database_service as any, 'createBackupSqlite')
				.mockResolvedValue(Buffer.from('a'));
			const spy_postgres = jest
				.spyOn<any, any>(cashu_mint_database_service as any, 'createBackupPostgres')
				.mockResolvedValue(Buffer.from('b'));
			const buf1 = await cashu_mint_database_service.createBackup({type: MintDatabaseType.sqlite, database: {}} as any);
			expect(spy_sqlite).toHaveBeenCalled();
			const buf2 = await cashu_mint_database_service.createBackup({type: MintDatabaseType.postgres, database: {}} as any);
			expect(spy_postgres).toHaveBeenCalled();
			expect(buf1.equals(Buffer.from('a'))).toBe(true);
			expect(buf2.equals(Buffer.from('b'))).toBe(true);
		});

		it('createBackup sqlite: success and cleanup', async () => {
			const BetterSqlite3 = require('better-sqlite3');
			const db_instance = new BetterSqlite3();
			(db_instance.backup as jest.Mock).mockResolvedValue(undefined);
			const read_file = jest.spyOn(fs_promises, 'readFile').mockResolvedValue(Buffer.from('ok'));
			const unlink = jest.spyOn(fs_promises, 'unlink').mockResolvedValue(undefined as any);
			const buf = await (cashu_mint_database_service as any).createBackupSqlite({database: db_instance});
			expect(read_file).toHaveBeenCalled();
			expect(unlink).toHaveBeenCalled();
			expect(buf.equals(Buffer.from('ok'))).toBe(true);
		});

		it('createBackup sqlite: error path cleans up and rethrows', async () => {
			const BetterSqlite3 = require('better-sqlite3');
			const db_instance = new BetterSqlite3();
			(db_instance.backup as jest.Mock).mockRejectedValue(new Error('fail'));
			const unlink = jest.spyOn(fs_promises, 'unlink').mockResolvedValue(undefined as any);
			await expect((cashu_mint_database_service as any).createBackupSqlite({database: db_instance})).rejects.toBeInstanceOf(Error);
			expect(unlink).toHaveBeenCalled();
		});

		it('createBackup postgres: success spawns pg_dump and cleans up', async () => {
			config_service.get.mockImplementation((k: string) => {
				if (k === 'cashu.database') return 'postgres://user:pass@localhost:5432/db';
				return undefined as any;
			});
			const read_file = jest.spyOn(fs_promises, 'readFile').mockResolvedValue(Buffer.from('pg'));
			const unlink = jest.spyOn(fs_promises, 'unlink').mockResolvedValue(undefined as any);
			const spawn_mock = child_process.spawn as unknown as jest.Mock;
			spawn_mock.mockImplementation((): any => {
				return {
					on: (evt: string, cb: (code?: number | Error) => void) => {
						if (evt === 'close') cb(0);
						return undefined;
					},
				};
			});
			const buf = await (cashu_mint_database_service as any).createBackupPostgres();
			expect(spawn_mock).toHaveBeenCalledWith(
				'pg_dump',
				expect.arrayContaining(['--host=localhost', '--port=5432', '--username=user', '--dbname=db']),
				expect.objectContaining({env: expect.objectContaining({PGPASSWORD: 'pass'})}),
			);
			expect(unlink).toHaveBeenCalled();
			expect(buf.equals(Buffer.from('pg'))).toBe(true);
		});

		it('createBackup postgres: non-zero exit throws MintDatabaseBackupError', async () => {
			config_service.get.mockImplementation((k: string) => (k === 'cashu.database' ? 'postgres://u:p@h:5432/d' : (undefined as any)));
			jest.spyOn(fs_promises, 'readFile').mockResolvedValue(Buffer.from('pg'));
			const unlink = jest.spyOn(fs_promises, 'unlink').mockResolvedValue(undefined as any);
			(child_process.spawn as unknown as jest.Mock).mockImplementation((): any => {
				return {
					on: (evt: string, cb: (code?: number | Error) => void) => {
						if (evt === 'close') cb(1);
						return undefined;
					},
				};
			});
			await expect((cashu_mint_database_service as any).createBackupPostgres()).rejects.toBe(
				OrchardErrorCode.MintDatabaseBackupError,
			);
			expect(unlink).toHaveBeenCalled();
		});

		it('restoreBackup sqlite: success path validates, copies, and cleans up', async () => {
			config_service.get.mockImplementation((k: string) => {
				if (k === 'cashu.database') return '/tmp/sqlite.db';
				return undefined as any;
			});
			await cashu_mint_database_service.onModuleInit();
			jest.spyOn<any, any>(cashu_mint_database_service as any, 'validateSqliteFile').mockResolvedValue(true);
			jest.spyOn(fs_promises, 'writeFile').mockResolvedValue(undefined as any);
			jest.spyOn(fs_promises, 'unlink').mockResolvedValue(undefined as any);
			const copy_file = jest.spyOn(fs_promises, 'copyFile').mockResolvedValue(undefined as any);
			await (cashu_mint_database_service as any).restoreBackupSqlite(Buffer.from('data').toString('base64'));
			expect(copy_file).toHaveBeenCalled();
		});

		it('restoreBackup sqlite: invalid file rejects with MintDatabaseRestoreInvalidError', async () => {
			jest.spyOn<any, any>(cashu_mint_database_service as any, 'validateSqliteFile').mockResolvedValue(false);
			jest.spyOn(fs_promises, 'writeFile').mockResolvedValue(undefined as any);
			const unlink = jest.spyOn(fs_promises, 'unlink').mockResolvedValue(undefined as any);
			await expect((cashu_mint_database_service as any).restoreBackupSqlite(Buffer.from('data').toString('base64'))).rejects.toBe(
				OrchardErrorCode.MintDatabaseRestoreInvalidError,
			);
			expect(unlink).toHaveBeenCalled();
		});

		it('restoreBackup sqlite: copy error rejects and cleans temp', async () => {
			jest.spyOn<any, any>(cashu_mint_database_service as any, 'validateSqliteFile').mockResolvedValue(true);
			jest.spyOn(fs_promises, 'writeFile').mockResolvedValue(undefined as any);
			const unlink = jest.spyOn(fs_promises, 'unlink').mockResolvedValue(undefined as any);
			jest.spyOn(fs_promises, 'copyFile').mockRejectedValue(new Error('copy-fail'));
			await expect(
				(cashu_mint_database_service as any).restoreBackupSqlite(Buffer.from('x').toString('base64')),
			).rejects.toBeInstanceOf(Error);
			expect(unlink).toHaveBeenCalled();
		});

		it('restoreBackup sqlite: write error rejects', async () => {
			jest.spyOn(fs_promises, 'writeFile').mockRejectedValue(new Error('write-fail'));
			await expect(
				(cashu_mint_database_service as any).restoreBackupSqlite(Buffer.from('x').toString('base64')),
			).rejects.toBeInstanceOf(Error);
		});

		it('restoreBackup dispatches by database_type', async () => {
			const spy_sqlite = jest.spyOn<any, any>(cashu_mint_database_service as any, 'restoreBackupSqlite').mockResolvedValue(undefined);
			const spy_postgres = jest
				.spyOn<any, any>(cashu_mint_database_service as any, 'restoreBackupPostgres')
				.mockResolvedValue(undefined);
			config_service.get.mockImplementation((k: string) => (k === 'cashu.database_type' ? 'sqlite' : (undefined as any)));
			await cashu_mint_database_service.restoreBackup('');
			expect(spy_sqlite).toHaveBeenCalled();
			config_service.get.mockImplementation((k: string) => (k === 'cashu.database_type' ? 'postgres' : (undefined as any)));
			await cashu_mint_database_service.restoreBackup('');
			expect(spy_postgres).toHaveBeenCalled();
		});

		it('restoreBackup postgres: success runs psql and unlinks', async () => {
			config_service.get.mockImplementation((k: string) => (k === 'cashu.database' ? 'postgres://u:p@h:5432/d' : (undefined as any)));
			jest.spyOn(fs_promises, 'writeFile').mockResolvedValue(undefined as any);
			const unlink = jest.spyOn(fs_promises, 'unlink').mockResolvedValue(undefined as any);
			const spawn_mock = child_process.spawn as unknown as jest.Mock;
			spawn_mock.mockImplementation((): any => {
				return {
					on: (evt: string, cb: (code?: number | Error) => void) => {
						if (evt === 'close') cb(0);
						return undefined;
					},
				};
			});
			await (cashu_mint_database_service as any).restoreBackupPostgres(Buffer.from('sql').toString('base64'));
			expect(spawn_mock).toHaveBeenCalledWith(
				'psql',
				expect.arrayContaining(['--host=h', '--port=5432', '--username=u', '--dbname=d']),
				expect.objectContaining({env: expect.objectContaining({PGPASSWORD: 'p'})}),
			);
			expect(unlink).toHaveBeenCalled();
		});

		it('restoreBackup postgres: failure throws MintDatabaseRestoreError', async () => {
			config_service.get.mockImplementation((k: string) => (k === 'cashu.database' ? 'postgres://u:p@h:5432/d' : (undefined as any)));
			jest.spyOn(fs_promises, 'writeFile').mockResolvedValue(undefined as any);
			jest.spyOn(fs_promises, 'unlink').mockResolvedValue(undefined as any);
			(child_process.spawn as unknown as jest.Mock).mockImplementation((): any => {
				return {
					on: (evt: string, cb: (code?: number | Error) => void) => {
						if (evt === 'close') cb(1);
						return undefined;
					},
				};
			});
			await expect((cashu_mint_database_service as any).restoreBackupPostgres(Buffer.from('sql').toString('base64'))).rejects.toBe(
				OrchardErrorCode.MintDatabaseRestoreError,
			);
		});
	});
});
