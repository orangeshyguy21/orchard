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
		fixture.componentRef.setInput('lightning_info', null);
		fixture.componentRef.setInput('lightning_channels', null);
		fixture.componentRef.setInput('lightning_closed_channels', null);
		fixture.componentRef.setInput('enabled_taproot_assets', false);
		fixture.componentRef.setInput('taproot_assets', null);
		fixture.componentRef.setInput('bitcoin_oracle_enabled', false);
		fixture.componentRef.setInput('bitcoin_oracle_price', null);
		fixture.componentRef.setInput('device_type', 'desktop');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
