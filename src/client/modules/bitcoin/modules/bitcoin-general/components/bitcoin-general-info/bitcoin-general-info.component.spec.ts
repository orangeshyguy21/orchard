/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinGeneralModule} from '@client/modules/bitcoin/modules/bitcoin-general/bitcoin-general.module';
/* Local Dependencies */
import {BitcoinGeneralInfoComponent} from './bitcoin-general-info.component';

describe('BitcoinGeneralInfoComponent', () => {
	let component: BitcoinGeneralInfoComponent;
	let fixture: ComponentFixture<BitcoinGeneralInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinGeneralInfoComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('blockchain_info', null);
		fixture.componentRef.setInput('network_info', null);
		fixture.componentRef.setInput('blockcount', 0);
		fixture.componentRef.setInput('error', false);
		fixture.componentRef.setInput('device_type', 'desktop');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
