/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintProofService} from './mintproof.service';

describe('MintProofService', () => {
	let mint_proof_service: MintProofService;

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
	});

	it('should be defined', () => {
		expect(mint_proof_service).toBeDefined();
	});
});
