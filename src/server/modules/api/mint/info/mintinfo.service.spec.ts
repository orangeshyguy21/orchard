/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
/* Application Dependencies */
import {CashuMintApiService} from '@server/modules/cashu/mintapi/cashumintapi.service';
import {CashuMintRpcService} from '@server/modules/cashu/mintrpc/cashumintrpc.service';
import {ErrorService} from '@server/modules/error/error.service';
import {OrchardErrorCode} from '@server/modules/error/error.types';
import {OrchardApiError} from '@server/modules/graphql/classes/orchard-error.class';
/* Local Dependencies */
import {MintInfoService} from './mintinfo.service';
import {OrchardMintInfo, OrchardMintInfoRpc} from './mintinfo.model';

describe('MintInfoService', () => {
	let mintInfoService: MintInfoService;
	let mintApiService: jest.Mocked<CashuMintApiService>;
	let mintRpcService: jest.Mocked<CashuMintRpcService>;
	let errorService: jest.Mocked<ErrorService>;

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

		mintInfoService = module.get<MintInfoService>(MintInfoService);
		mintApiService = module.get(CashuMintApiService);
		mintRpcService = module.get(CashuMintRpcService);
		errorService = module.get(ErrorService);
	});

	it('should be defined', () => {
		expect(mintInfoService).toBeDefined();
	});

	it('getMintInfo returns OrchardMintInfo on success', async () => {
		// minimal shape for OrchardMintInfo mapping
		mintApiService.getMintInfo.mockResolvedValue({
			name: 'm',
			pubkey: 'p',
			version: 'v',
			description: 'd',
			description_long: 'dl',
			contact: [],
			icon_url: 'u',
			tos_url: 't',
			urls: [],
			time: 0,
			nuts: {
				'4': {methods: {}, disabled: false},
				'5': {methods: {}, disabled: false},
				'7': {supported: true},
				'8': {supported: true},
				'9': {supported: true},
				'10': {supported: true},
				'11': {supported: true},
				'12': {supported: true},
			},
		} as any);
		const result = await mintInfoService.getMintInfo('TAG');
		expect(result).toBeInstanceOf(OrchardMintInfo);
	});

	it('getMintInfoRpc returns OrchardMintInfoRpc on success', async () => {
		mintRpcService.getMintInfo.mockResolvedValue({
			name: 'm',
			version: 'v',
			description: 'd',
			description_long: 'dl',
			motd: 'm',
			total_issued: '0',
			total_redeemed: '0',
			contact: [],
			icon_url: 'u',
			urls: [],
		} as any);
		const result = await mintInfoService.getMintInfoRpc('TAG');
		expect(result).toBeInstanceOf(OrchardMintInfoRpc);
	});

	it('update operations call RPC and return inputs', async () => {
		await mintInfoService.updateMintName('TAG', {name: 'x'} as any);
		await mintInfoService.updateMintIcon('TAG', {icon_url: 'u'} as any);
		await mintInfoService.updateMintShortDescription('TAG', {description: 's'} as any);
		await mintInfoService.updateMintLongDescription('TAG', {description: 'l'} as any);
		await mintInfoService.updateMintMotd('TAG', {motd: 'm'} as any);
		await mintInfoService.addMintUrl('TAG', {url: 'u'} as any);
		await mintInfoService.removeMintUrl('TAG', {url: 'u'} as any);
		await mintInfoService.addMintContact('TAG', {method: 'm', info: 'i'} as any);
		await mintInfoService.removeMintContact('TAG', {method: 'm', info: 'i'} as any);
		expect(mintRpcService.updateName).toHaveBeenCalled();
		expect(mintRpcService.updateIconUrl).toHaveBeenCalled();
		expect(mintRpcService.updateShortDescription).toHaveBeenCalled();
		expect(mintRpcService.updateLongDescription).toHaveBeenCalled();
		expect(mintRpcService.updateMotd).toHaveBeenCalled();
		expect(mintRpcService.addUrl).toHaveBeenCalled();
		expect(mintRpcService.removeUrl).toHaveBeenCalled();
		expect(mintRpcService.addContact).toHaveBeenCalled();
		expect(mintRpcService.removeContact).toHaveBeenCalled();
	});

	it('wraps errors via resolveError and throws OrchardApiError (getMintInfo)', async () => {
		const err = new Error('boom');
		mintApiService.getMintInfo.mockRejectedValue(err);
		errorService.resolveError.mockReturnValue({code: OrchardErrorCode.MintPublicApiError});
		await expect(mintInfoService.getMintInfo('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = errorService.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintPublicApiError});
	});
});
