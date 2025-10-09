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
import {MintBalanceService} from './mintbalance.service';
import {OrchardMintBalance} from './mintbalance.model';

describe('MintBalanceService', () => {
	let mint_balance_service: MintBalanceService;
	let mint_db_service: jest.Mocked<CashuMintDatabaseService>;
	let mint_service: jest.Mocked<MintService>;
	let error_service: jest.Mocked<ErrorService>;

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
		mint_db_service = module.get(CashuMintDatabaseService) as any;
		mint_service = module.get(MintService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(mint_balance_service).toBeDefined();
	});

	it('getMintBalances maps to OrchardMintBalance[]', async () => {
		mint_db_service.getMintBalances.mockResolvedValue([{keyset: 'k', balance: 1}] as any);
		const result = await mint_balance_service.getMintBalances('TAG', 'k');
		expect(result[0]).toBeInstanceOf(OrchardMintBalance);
	});

	it('getIssuedMintBalances maps to OrchardMintBalance[]', async () => {
		mint_db_service.getMintBalancesIssued.mockResolvedValue([{keyset: 'k', balance: 1}] as any);
		const result = await mint_balance_service.getIssuedMintBalances('TAG');
		expect(result[0]).toBeInstanceOf(OrchardMintBalance);
	});

	it('getRedeemedMintBalances maps to OrchardMintBalance[]', async () => {
		mint_db_service.getMintBalancesRedeemed.mockResolvedValue([{keyset: 'k', balance: 1}] as any);
		const result = await mint_balance_service.getRedeemedMintBalances('TAG');
		expect(result[0]).toBeInstanceOf(OrchardMintBalance);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mint_db_service.getMintBalances.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintDatabaseSelectError);
		await expect(mint_balance_service.getMintBalances('MY_TAG', 'k')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
