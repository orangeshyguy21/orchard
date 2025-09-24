/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
/* Local Dependencies */
import {CredentialService} from './credential.service';

describe('CredentialService', () => {
	let credential_service: CredentialService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [CredentialService],
		}).compile();

		credential_service = module.get<CredentialService>(CredentialService);
	});

	it('should be defined', () => {
		expect(credential_service).toBeDefined();
	});
});
