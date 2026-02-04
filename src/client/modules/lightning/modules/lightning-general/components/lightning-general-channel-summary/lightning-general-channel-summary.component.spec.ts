/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcLightningGeneralModule} from '@client/modules/lightning/modules/lightning-general/lightning-general.module';
/* Local Dependencies */
import {LightningGeneralChannelSummaryComponent} from './lightning-general-channel-summary.component';

describe('LightningGeneralChannelSummaryComponent', () => {
	    let component: LightningGeneralChannelSummaryComponent;
	let fixture: ComponentFixture<LightningGeneralChannelSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcLightningGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningGeneralChannelSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
