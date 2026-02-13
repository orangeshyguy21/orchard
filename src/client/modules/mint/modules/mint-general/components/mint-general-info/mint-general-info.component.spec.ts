/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralInfoComponent} from './mint-general-info.component';

describe('MintGeneralInfoComponent', () => {
	let component: MintGeneralInfoComponent;
	let fixture: ComponentFixture<MintGeneralInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
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
});
