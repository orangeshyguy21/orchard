/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintDatabaseService} from '@server/modules/cashu/mintdb/cashumintdb.service';
import {MintService} from '@server/modules/api/mint/mint.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintBalanceService} from './mintbalance.service';

describe('MintBalanceService', () => {
	let mint_balance_service: MintBalanceService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintBalanceService,
				{
					provide: CashuMintDatabaseService,
					useValue: {getMintBalances: jest.fn(), getMintBalancesIssued: jest.fn(), getMintBalancesRedeemed: jest.fn()},
				},
				{provide: MintService, useValue: {withDbClient: jest.fn((fn) => fn({}))}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_balance_service = module.get<MintBalanceService>(MintBalanceService);
	});

	it('should be defined', () => {
		expect(mint_balance_service).toBeDefined();
	});
});
