/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Native Dependencies */
import {MintService} from '@server/modules/api/mint/mint.service';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintKeysetService} from './mintkeyset.service';

describe('MintKeysetService', () => {
	let mint_keyset_service: MintKeysetService;

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
	});

	it('should be defined', () => {
		expect(mint_keyset_service).toBeDefined();
	});
});
