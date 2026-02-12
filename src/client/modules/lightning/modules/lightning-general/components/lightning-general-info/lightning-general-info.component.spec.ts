/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcLightningGeneralModule} from '@client/modules/lightning/modules/lightning-general/lightning-general.module';
/* Local Dependencies */
import {LightningGeneralInfoComponent} from './lightning-general-info.component';

describe('LightningGeneralInfoComponent', () => {
	let component: LightningGeneralInfoComponent;
	let fixture: ComponentFixture<LightningGeneralInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcLightningGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningGeneralInfoComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('lightning_info', null);
		fixture.componentRef.setInput('error', false);
		fixture.componentRef.setInput('device_type', 'desktop');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
