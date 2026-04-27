/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
/* Application Dependencies */
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {PublicUrl} from '@client/modules/public/classes/public-url.class';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Shared Dependencies */
import {OrchardMintInfo, OrchardNuts} from '@shared/generated.types';
/* Local Dependencies */
import {MintGeneralInfoComponent} from './mint-general-info.component';

function buildMockInfo(overrides: Partial<OrchardMintInfo> = {}): MintInfo {
	return new MintInfo({
		name: 'Test Mint',
		pubkey: 'abc123',
		version: '0.1.0',
		description: null,
		description_long: null,
		contact: null,
		icon_url: null,
		tos_url: null,
		urls: null,
		time: 1700000000,
		nuts: {} as OrchardNuts,
		...overrides,
	});
}

function buildPublicUrl(url: string | null, status: number, has_data = true): PublicUrl {
	return new PublicUrl({url, status, ip_address: null, has_data});
}

describe('MintGeneralInfoComponent', () => {
	let component: MintGeneralInfoComponent;
	let fixture: ComponentFixture<MintGeneralInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralInfoComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('icon_data', null);
		fixture.componentRef.setInput('info', null);
		fixture.componentRef.setInput('error', false);
		fixture.componentRef.setInput('device_type', 'desktop');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('state', () => {
		it('should return online when no error', () => {
			expect(component.state()).toBe('online');
		});

		it('should return offline when error is true', () => {
			fixture.componentRef.setInput('error', true);
			fixture.detectChanges();
			expect(component.state()).toBe('offline');
		});
	});

	describe('status', () => {
		it('should return active when no error', () => {
			expect(component.status()).toBe('active');
		});

		it('should return inactive when error is true', () => {
			fixture.componentRef.setInput('error', true);
			fixture.detectChanges();
			expect(component.status()).toBe('inactive');
		});
	});

	describe('uris', () => {
		it('should return empty array when info is null', () => {
			expect(component.uris()).toEqual([]);
		});

		it('should return empty array when info has null urls', () => {
			fixture.componentRef.setInput('info', buildMockInfo({urls: null}));
			fixture.detectChanges();
			expect(component.uris()).toEqual([]);
		});

		it('should label clearnet hosts by hostname', () => {
			fixture.componentRef.setInput('info', buildMockInfo({urls: ['https://mint.example.com']}));
			fixture.detectChanges();
			const [uri] = component.uris();
			expect(uri).toEqual({
				uri: 'https://mint.example.com',
				origin: 'https://mint.example.com',
				type: 'clearnet',
				label: 'mint.example.com',
			});
		});

		it('should append non-default port to clearnet labels', () => {
			fixture.componentRef.setInput('info', buildMockInfo({urls: ['https://mint.example.com:8080']}));
			fixture.detectChanges();
			const [uri] = component.uris();
			expect(uri.label).toBe('mint.example.com:8080');
			expect(uri.origin).toBe('https://mint.example.com:8080');
		});

		it('should mark http urls as insecure', () => {
			fixture.componentRef.setInput('info', buildMockInfo({urls: ['http://mint.example.com']}));
			fixture.detectChanges();
			expect(component.uris()[0].type).toBe('insecure');
		});

		it('should mark .onion urls as tor and truncate the host label', () => {
			const long_onion = 'http://abcdefghijklmnopqrstuvwxyz234567.onion';
			fixture.componentRef.setInput('info', buildMockInfo({urls: [long_onion]}));
			fixture.detectChanges();
			const [uri] = component.uris();
			expect(uri.type).toBe('tor');
			expect(uri.label).toBe('abcdefghijklmno...onion');
		});

		it('should fall back to truncated raw string when URL parsing fails for tor', () => {
			const malformed_tor = 'not-a-valid-url-but-has-abcdefghijklmnopqrst.onion';
			fixture.componentRef.setInput('info', buildMockInfo({urls: [malformed_tor]}));
			fixture.detectChanges();
			const [uri] = component.uris();
			expect(uri.type).toBe('tor');
			expect(uri.label).toBe('not-a-valid-url...onion');
			expect(uri.origin).toBe(malformed_tor);
		});

		it('should fall back to raw string when URL parsing fails for non-tor', () => {
			fixture.componentRef.setInput('info', buildMockInfo({urls: ['not-a-valid-url']}));
			fixture.detectChanges();
			const [uri] = component.uris();
			expect(uri.type).toBe('clearnet');
			expect(uri.label).toBe('not-a-valid-url');
			expect(uri.origin).toBe('not-a-valid-url');
		});
	});

	describe('connections_status_map', () => {
		it('should be empty when no connections provided', () => {
			expect(component.connections_status_map().size).toBe(0);
		});

		it('should index connection_status by origin and skip null urls', () => {
			fixture.componentRef.setInput('connections', [
				buildPublicUrl('https://mint.example.com', 200),
				buildPublicUrl('https://other.example.com', 500),
				buildPublicUrl(null, 0),
			]);
			fixture.detectChanges();

			const map = component.connections_status_map();
			expect(map.size).toBe(2);
			expect(map.get('https://mint.example.com')).toBe('active');
			expect(map.get('https://other.example.com')).toBe('inactive');
		});
	});

	describe('onUriClick', () => {
		let dialog_open_spy: jasmine.Spy;

		beforeEach(() => {
			const dialog = TestBed.inject(MatDialog);
			dialog_open_spy = spyOn(dialog, 'open').and.stub();
		});

		it('should open dialog with mint metadata and connection status', () => {
			fixture.componentRef.setInput('icon_data', 'data:image/png;base64,xyz');
			fixture.componentRef.setInput('info', buildMockInfo({name: 'Test Mint', urls: ['https://mint.example.com']}));
			fixture.componentRef.setInput('connections', [buildPublicUrl('https://mint.example.com', 200)]);
			fixture.detectChanges();

			const [uri] = component.uris();
			component.onUriClick(uri);

			expect(dialog_open_spy).toHaveBeenCalledTimes(1);
			const config = dialog_open_spy.calls.mostRecent().args[1];
			expect(config.data).toEqual({
				uri: 'https://mint.example.com',
				type: 'clearnet',
				label: 'mint.example.com',
				image: 'data:image/png;base64,xyz',
				name: 'Test Mint',
				section: 'mint',
				status: 'active',
				device_type: 'desktop',
			});
		});

		it('should fall back to placeholder image, empty name, and null status when inputs are unset', () => {
			component.onUriClick({
				uri: 'https://nowhere.example.com',
				origin: 'https://nowhere.example.com',
				type: 'clearnet',
				label: 'nowhere.example.com',
			});

			const config = dialog_open_spy.calls.mostRecent().args[1];
			expect(config.data.image).toBe('/mint-icon-placeholder.png');
			expect(config.data.name).toBe('');
			expect(config.data.status).toBeNull();
		});
	});
});
