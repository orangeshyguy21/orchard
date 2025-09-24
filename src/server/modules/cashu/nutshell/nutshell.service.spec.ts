/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
/* Local Dependencies */
import {NutshellService} from './nutshell.service';

describe('NutshellService', () => {
	let nutshell_service: NutshellService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				NutshellService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadPemOrPath: jest.fn()}},
			],
		}).compile();

		nutshell_service = module.get<NutshellService>(NutshellService);
	});

	it('should be defined', () => {
		expect(nutshell_service).toBeDefined();
	});
});
