/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Native Dependencies */
import {MintService} from '@server/modules/api/mint/mint.service';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintfeeService} from './mintfee.service';

describe('MintfeeService', () => {
	let mintfee_service: MintfeeService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintfeeService,
				{provide: MintService, useValue: {withDbClient: jest.fn((fn: any) => fn({}))}},
				{provide: CashuMintDatabaseService, useValue: {getMintFees: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mintfee_service = module.get<MintfeeService>(MintfeeService);
	});

	it('should be defined', () => {
		expect(mintfee_service).toBeDefined();
	});
});
