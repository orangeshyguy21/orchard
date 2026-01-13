/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardMintEnabledComponent} from './index-subsection-dashboard-mint-enabled.component';

describe('IndexSubsectionDashboardMintEnabledComponent', () => {
	let component: IndexSubsectionDashboardMintEnabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardMintEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardMintEnabledComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('loading_icon', false);
		fixture.componentRef.setInput('info', null);
		fixture.componentRef.setInput('keysets', []);
		fixture.componentRef.setInput('balances', []);
		fixture.componentRef.setInput('icon_data', null);
		fixture.componentRef.setInput('lightning_balance', null);
		fixture.componentRef.setInput('lightning_enabled', false);
		fixture.componentRef.setInput('lightning_errors', []);
		fixture.componentRef.setInput('lightning_loading', false);
		fixture.componentRef.setInput('device_desktop', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
