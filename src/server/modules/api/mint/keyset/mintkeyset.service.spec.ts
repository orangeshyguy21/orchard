/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Native Dependencies */
import {MintService} from '@server/modules/api/mint/mint.service';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {MintKeysetService} from './mintkeyset.service';
import {OrchardMintKeyset, OrchardMintKeysetProofCount} from './mintkeyset.model';

describe('MintKeysetService', () => {
	let mint_keyset_service: MintKeysetService;
	let _mint_service: jest.Mocked<MintService>;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let mint_rpc_service: jest.Mocked<CashuMintRpcService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintKeysetService,
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: CashuMintDatabaseService, useValue: {getMintKeysets: jest.fn(), getMintKeysetProofCounts: jest.fn()}},
				{provide: CashuMintRpcService, useValue: {rotateNextKeyset: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_keyset_service = module.get<MintKeysetService>(MintKeysetService);
		_mint_service = module.get(MintService);
		mint_db_service = module.get(CashuMintDatabaseService);
		mint_rpc_service = module.get(CashuMintRpcService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mint_keyset_service).toBeDefined();
	});

	it('getMintKeysets returns OrchardMintKeyset[]', async () => {
		mint_db_service.getMintKeysets.mockResolvedValue([{id: 'k'}] as any);
		const result = await mint_keyset_service.getMintKeysets('TAG');
		expect(result[0]).toBeInstanceOf(OrchardMintKeyset);
	});

	it('getMintKeysetProofCounts returns OrchardMintKeysetProofCount[]', async () => {
		mint_db_service.getMintKeysetProofCounts.mockResolvedValue([{id: 'k', count: 1}] as any);
		const result = await mint_keyset_service.getMintKeysetProofCounts('TAG', {} as any);
		expect(result[0]).toBeInstanceOf(OrchardMintKeysetProofCount);
	});

	it('mintRotateKeyset returns input on success', async () => {
		mint_rpc_service.rotateNextKeyset.mockResolvedValue({} as any);
		const result = await mint_keyset_service.mintRotateKeyset('TAG', {unit: 'sat'} as any);
		expect(result).toBeDefined();
	});

	it('wraps errors via resolveError and throws OrchardApiError (db)', async () => {
		mint_db_service.getMintKeysets.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseSelectError);
		await expect(mint_keyset_service.getMintKeysets('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintDatabaseSelectError});
	});
});
