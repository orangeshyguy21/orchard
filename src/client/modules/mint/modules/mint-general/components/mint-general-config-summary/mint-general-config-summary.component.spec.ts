/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintGeneralModule} from '@client/modules/mint/modules/mint-general/mint-general.module';
/* Local Dependencies */
import {MintGeneralConfigSummaryComponent} from './mint-general-config-summary.component';

describe('MintGeneralConfigSummaryComponent', () => {
	let component: MintGeneralConfigSummaryComponent;
	let fixture: ComponentFixture<MintGeneralConfigSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralConfigSummaryComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('info', null);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
