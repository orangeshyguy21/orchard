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
	let mintKeysetService: MintKeysetService;
	let mintDbService: jest.Mocked<CashuMintDatabaseService>;
	let mintRpcService: jest.Mocked<CashuMintRpcService>;
	let errorService: jest.Mocked<ErrorService>;

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

		mintKeysetService = module.get<MintKeysetService>(MintKeysetService);
		mintDbService = module.get(CashuMintDatabaseService);
		mintRpcService = module.get(CashuMintRpcService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mintKeysetService).toBeDefined();
	});

	it('getMintKeysets returns OrchardMintKeyset[]', async () => {
		mintDbService.getMintKeysets.mockResolvedValue([{id: 'k'}] as any);
		const result = await mintKeysetService.getMintKeysets('TAG');
		expect(result[0]).toBeInstanceOf(OrchardMintKeyset);
	});

	it('getMintKeysetProofCounts returns OrchardMintKeysetProofCount[]', async () => {
		mintDbService.getMintKeysetProofCounts.mockResolvedValue([{id: 'k', count: 1}] as any);
		const result = await mintKeysetService.getMintKeysetProofCounts('TAG', {} as any);
		expect(result[0]).toBeInstanceOf(OrchardMintKeysetProofCount);
	});

	it('mintRotateKeyset returns input on success', async () => {
		mintRpcService.rotateNextKeyset.mockResolvedValue({} as any);
		const result = await mintKeysetService.mintRotateKeyset('TAG', {unit: 'sat'} as any);
		expect(result).toBeDefined();
	});

	it('wraps errors via resolveError and throws OrchardApiError (db)', async () => {
		mintDbService.getMintKeysets.mockRejectedValue(new Error('boom'));
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintDatabaseSelectError});
		await expect(mintKeysetService.getMintKeysets('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = errorService.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintDatabaseSelectError});
	});
});
