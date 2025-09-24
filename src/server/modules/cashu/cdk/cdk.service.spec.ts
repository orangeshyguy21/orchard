/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from '@nestjs/config';
/* Application Dependencies */
import {CredentialService} from '@server/modules/credential/credential.service';
/* Local Dependencies */
import {CdkService} from './cdk.service';

describe('CdkService', () => {
	let cdk_service: CdkService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CdkService,
				{provide: ConfigService, useValue: {get: jest.fn()}},
				{provide: CredentialService, useValue: {loadPemOrPath: jest.fn()}},
			],
		}).compile();

		cdk_service = module.get<CdkService>(CdkService);
	});

	it('should be defined', () => {
		expect(cdk_service).toBeDefined();
	});
});
