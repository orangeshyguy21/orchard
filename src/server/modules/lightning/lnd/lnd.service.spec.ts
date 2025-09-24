/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
/* Local Dependencies */
import {LndService} from './lnd.service';

describe('LndService', () => {
	let lnd_service: LndService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LndService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadMacaroonHex: jest.fn(), loadPemOrPath: jest.fn()}},
			],
		}).compile();

		lnd_service = module.get<LndService>(LndService);
	});

	it('should be defined', () => {
		expect(lnd_service).toBeDefined();
	});
});
