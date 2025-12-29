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
	let mintBalanceService: MintBalanceService;
	let mintDbService: jest.Mocked<CashuMintDatabaseService>;
	let errorService: jest.Mocked<ErrorService>;

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

		mintBalanceService = module.get<MintBalanceService>(MintBalanceService);
		mintDbService = module.get(CashuMintDatabaseService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mintBalanceService).toBeDefined();
	});

	it('getMintBalances maps to OrchardMintBalance[]', async () => {
		mintDbService.getMintBalances.mockResolvedValue([{keyset: 'k', balance: 1}] as any);
		const result = await mintBalanceService.getMintBalances('TAG', 'k');
		expect(result[0]).toBeInstanceOf(OrchardMintBalance);
	});

	it('getIssuedMintBalances maps to OrchardMintBalance[]', async () => {
		mintDbService.getMintBalancesIssued.mockResolvedValue([{keyset: 'k', balance: 1}] as any);
		const result = await mintBalanceService.getIssuedMintBalances('TAG');
		expect(result[0]).toBeInstanceOf(OrchardMintBalance);
	});

	it('getRedeemedMintBalances maps to OrchardMintBalance[]', async () => {
		mintDbService.getMintBalancesRedeemed.mockResolvedValue([{keyset: 'k', balance: 1}] as any);
		const result = await mintBalanceService.getRedeemedMintBalances('TAG');
		expect(result[0]).toBeInstanceOf(OrchardMintBalance);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		mintDbService.getMintBalances.mockRejectedValue(new Error('boom'));
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintDatabaseSelectError});
		await expect(mintBalanceService.getMintBalances('MY_TAG', 'k')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
