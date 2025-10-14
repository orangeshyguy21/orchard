/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {FetchService} from '@server/modules/fetch/fetch.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {PublicImageService} from './image.service';
import {OrchardPublicImage} from './image.model';

describe('PublicImageService', () => {
	let public_image_service: PublicImageService;
	let fetch_service: jest.Mocked<FetchService>;
	let error_service: jest.Mocked<ErrorService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PublicImageService,
				{provide: FetchService, useValue: {fetchWithProxy: jest.fn()}},
				{provide: ErrorService, useValue: {resolveError: jest.fn()}},
			],
		}).compile();

		public_image_service = module.get<PublicImageService>(PublicImageService);
		fetch_service = module.get(FetchService);
		error_service = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(public_image_service).toBeDefined();
	});

	it('returns OrchardPublicImage with content type and buffer', async () => {
		const headers = new Map<string, string>();
		headers.set('content-type', 'image/png');
		const response = {
			headers: {get: (k: string) => headers.get(k) || null},
			arrayBuffer: async () => new TextEncoder().encode('data').buffer,
		} as any;
		fetch_service.fetchWithProxy.mockResolvedValue(response);
		const result = await public_image_service.getImageData('TAG', 'https://example.com/i.png');
		expect(result).toBeInstanceOf(OrchardPublicImage);
		expect(result.type).toBe('image/png');
		expect(result.data?.startsWith('data:image/png;base64,')).toBe(true);
	});

	it('wraps errors via resolveError and throws OrchardApiError', async () => {
		fetch_service.fetchWithProxy.mockRejectedValue(new Error('boom'));
		error_service.resolveError.mockReturnValue(OrchardErrorCode.PublicAssetError);
		await expect(public_image_service.getImageData('MY_TAG', 'https://ex/i.png')).rejects.toBeInstanceOf(OrchardApiError);
	});
});
