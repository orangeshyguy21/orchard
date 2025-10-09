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
	let mint_info_service: MintInfoService;
	let mint_api_service: jest.Mocked<CashuMintApiService>;
	let mint_rpc_service: jest.Mocked<CashuMintRpcService>;
	let error_service: jest.Mocked<ErrorService>;

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
		mint_api_service = module.get(CashuMintApiService) as any;
		mint_rpc_service = module.get(CashuMintRpcService) as any;
		error_service = module.get(ErrorService) as any;
	});

	it('should be defined', () => {
		expect(mint_info_service).toBeDefined();
	});

	it('getMintInfo returns OrchardMintInfo on success', async () => {
		// minimal shape for OrchardMintInfo mapping
		mint_api_service.getMintInfo.mockResolvedValue({
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
		const result = await mint_info_service.getMintInfo('TAG');
		expect(result).toBeInstanceOf(OrchardMintInfo);
	});

	it('getMintInfoRpc returns OrchardMintInfoRpc on success', async () => {
		mint_rpc_service.getMintInfo.mockResolvedValue({
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
		const result = await mint_info_service.getMintInfoRpc('TAG');
		expect(result).toBeInstanceOf(OrchardMintInfoRpc);
	});

	it('update operations call RPC and return inputs', async () => {
		await mint_info_service.updateMintName('TAG', {name: 'x'} as any);
		await mint_info_service.updateMintIcon('TAG', {icon_url: 'u'} as any);
		await mint_info_service.updateMintShortDescription('TAG', {description: 's'} as any);
		await mint_info_service.updateMintLongDescription('TAG', {description: 'l'} as any);
		await mint_info_service.updateMintMotd('TAG', {motd: 'm'} as any);
		await mint_info_service.addMintUrl('TAG', {url: 'u'} as any);
		await mint_info_service.removeMintUrl('TAG', {url: 'u'} as any);
		await mint_info_service.addMintContact('TAG', {method: 'm', info: 'i'} as any);
		await mint_info_service.removeMintContact('TAG', {method: 'm', info: 'i'} as any);
		expect(mint_rpc_service.updateName).toHaveBeenCalled();
		expect(mint_rpc_service.updateIconUrl).toHaveBeenCalled();
		expect(mint_rpc_service.updateShortDescription).toHaveBeenCalled();
		expect(mint_rpc_service.updateLongDescription).toHaveBeenCalled();
		expect(mint_rpc_service.updateMotd).toHaveBeenCalled();
		expect(mint_rpc_service.addUrl).toHaveBeenCalled();
		expect(mint_rpc_service.removeUrl).toHaveBeenCalled();
		expect(mint_rpc_service.addContact).toHaveBeenCalled();
		expect(mint_rpc_service.removeContact).toHaveBeenCalled();
	});

	it('wraps errors via resolveError and throws OrchardApiError (getMintInfo)', async () => {
		const err = new Error('boom');
		mint_api_service.getMintInfo.mockRejectedValue(err);
		error_service.resolveError.mockReturnValue(OrchardErrorCode.MintPublicApiError);
		await expect(mint_info_service.getMintInfo('MY_TAG')).rejects.toBeInstanceOf(OrchardApiError);
		const calls = error_service.resolveError.mock.calls;
		const [, , tag_arg, code_arg] = calls[calls.length - 1];
		expect(tag_arg).toBe('MY_TAG');
		expect(code_arg).toEqual({errord: OrchardErrorCode.MintPublicApiError});
	});
});
