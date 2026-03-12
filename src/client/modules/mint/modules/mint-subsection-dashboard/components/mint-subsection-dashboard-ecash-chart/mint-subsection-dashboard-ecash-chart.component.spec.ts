/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionDashboardModule} from '@client/modules/mint/modules/mint-subsection-dashboard/mint-subsection-dashboard.module';
/* Local Dependencies */
import {MintSubsectionDashboardEcashChartComponent} from './mint-subsection-dashboard-ecash-chart.component';

describe('MintSubsectionDashboardEcashChartComponent', () => {
	let component: MintSubsectionDashboardEcashChartComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardEcashChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardEcashChartComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('locale', 'en-US');
		fixture.componentRef.setInput('mint_analytics_proofs', []);
		fixture.componentRef.setInput('mint_analytics_proofs_pre', []);
		fixture.componentRef.setInput('mint_analytics_promises', []);
		fixture.componentRef.setInput('mint_analytics_promises_pre', []);
		fixture.componentRef.setInput('page_settings', {date_start: 0, date_end: 0, units: [], interval: 'day'});
		fixture.componentRef.setInput('mint_genesis_time', 0);
		fixture.componentRef.setInput('selected_type', null);
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('device_mobile', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
