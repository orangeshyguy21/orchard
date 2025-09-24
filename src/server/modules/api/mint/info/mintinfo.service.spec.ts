/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Application Dependencies */
import {CashuMintApiService} from '@server/modules/cashu/mintapi/cashumintapi.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
/* Local Dependencies */
import {MintInfoService} from './mintinfo.service';

describe('MintInfoService', () => {
	let mint_info_service: MintInfoService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MintInfoService,
				{provide: CashuMintApiService, useValue: {getMintInfo: jest.fn()}},
				{
					provide: CashuMintRpcService,
					useValue: {
						getMintInfo: jest.fn(),
						updateName: jest.fn(),
						updateIconUrl: jest.fn(),
						updateShortDescription: jest.fn(),
						updateLongDescription: jest.fn(),
						updateMotd: jest.fn(),
						addUrl: jest.fn(),
						removeUrl: jest.fn(),
						addContact: jest.fn(),
						removeContact: jest.fn(),
					},
				},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		mint_info_service = module.get<MintInfoService>(MintInfoService);
	});

	it('should be defined', () => {
		expect(mint_info_service).toBeDefined();
	});
});
