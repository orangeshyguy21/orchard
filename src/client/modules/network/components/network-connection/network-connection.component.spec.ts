/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
/* Native Dependencies */
import {OrcNetworkModule} from '@client/modules/network/network.module';
/* Local Dependencies */
import {NetworkConnectionComponent} from './network-connection.component';

describe('NetworkConnectionComponent', () => {
	let component: NetworkConnectionComponent;
	let fixture: ComponentFixture<NetworkConnectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcNetworkModule],
			providers: [
				{
					provide: MAT_DIALOG_DATA,
					useValue: {
						uri: 'https://example.com',
						name: 'test',
						image: '',
						status: 'active',
						device_type: 'desktop',
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(NetworkConnectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
