/* Core Dependencies */
import {Test, TestingModule} from '@nestjs/testing';
import {expect} from '@jest/globals';
import * as fs from 'fs';
jest.mock('fs');
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

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('loadPemOrPath returns undefined when value is missing', () => {
		expect(credential_service.loadPemOrPath(undefined)).toBeUndefined();
	});

	it('loadPemOrPath reads from absolute file path', () => {
		(fs.readFileSync as unknown as jest.Mock).mockReturnValue(Buffer.from('pem-data'));
		const buf = credential_service.loadPemOrPath('/tmp/test.pem');
		expect(buf?.toString()).toBe('pem-data');
	});

	it('loadPemOrPath supports file:// scheme', () => {
		(fs.readFileSync as unknown as jest.Mock).mockReturnValue(Buffer.from('pem-furl'));
		const buf = credential_service.loadPemOrPath('file:///tmp/test.pem');
		expect(buf?.toString()).toBe('pem-furl');
	});

	it('loadPemOrPath decodes base64: prefix', () => {
		const buf = credential_service.loadPemOrPath('base64:ZGF0YQ==');
		expect(buf?.toString()).toBe('data');
	});

	it('loadPemOrPath decodes b64: prefix', () => {
		const buf = credential_service.loadPemOrPath('b64:Zg==');
		expect(buf?.toString()).toBe('f');
	});

	it('loadPemOrPath returns a buffer even for loosely invalid base64', () => {
		const buf = credential_service.loadPemOrPath('base64:***notb64***');
		expect(Buffer.isBuffer(buf)).toBe(true);
		expect(buf.length).toBeGreaterThan(0);
	});

	it('loadPemOrPath handles inline PEM with escaped newlines', () => {
		const pem = '-----BEGIN TEST-----\\nLINE1\\n-----END TEST-----';
		const buf = credential_service.loadPemOrPath(pem);
		expect(buf?.toString()).toContain('-----BEGIN TEST-----');
		expect(buf?.toString()).toContain('\nLINE1\n');
	});

	it('loadPemOrPath may treat short base64-like text as utf8', () => {
		const buf = credential_service.loadPemOrPath('ZGF0YQ==');
		expect(buf?.toString()).toBe('ZGF0YQ==');
	});

	it('loadPemOrPath returns a buffer for arbitrary text', () => {
		const buf = credential_service.loadPemOrPath('plain-text');
		expect(Buffer.isBuffer(buf)).toBe(true);
		expect(buf.length).toBeGreaterThan(0);
	});

	it('loadMacaroonHex returns undefined when value is missing', () => {
		expect(credential_service.loadMacaroonHex(undefined)).toBeUndefined();
	});

	it('loadMacaroonHex reads from absolute file path and returns hex', () => {
		(fs.readFileSync as unknown as jest.Mock).mockReturnValue(Buffer.from([0x01, 0x02, 0xab]));
		const hex = credential_service.loadMacaroonHex('/tmp/admin.macaroon');
		expect(hex).toBe('0102ab');
	});

	it('loadMacaroonHex accepts hex: prefix (lowercases)', () => {
		const hex = credential_service.loadMacaroonHex('hex:0ABC');
		expect(hex).toBe('0abc');
	});

	it('loadMacaroonHex rejects invalid hex: prefix', () => {
		const hex = credential_service.loadMacaroonHex('hex:xyz');
		expect(hex).toBeUndefined();
	});

	it('loadMacaroonHex decodes base64: prefix to hex', () => {
		// base64 of bytes 00 01 02 -> AAECAw? actually 0x00,0x01,0x02 is 'AAEC'
		const hex = credential_service.loadMacaroonHex('base64:AAEC');
		expect(hex).toBe('000102');
	});

	it('loadMacaroonHex accepts bare hex (even length)', () => {
		const hex = credential_service.loadMacaroonHex('A1B2');
		expect(hex).toBe('a1b2');
	});

	it('loadMacaroonHex decodes bare base64', () => {
		const hex = credential_service.loadMacaroonHex('AQID');
		expect(hex).toBe(Buffer.from('AQID', 'base64').toString('hex'));
	});
});
