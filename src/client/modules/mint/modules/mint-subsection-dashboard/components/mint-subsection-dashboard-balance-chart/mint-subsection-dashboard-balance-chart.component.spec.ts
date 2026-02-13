/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionDashboardModule} from '@client/modules/mint/modules/mint-subsection-dashboard/mint-subsection-dashboard.module';
/* Local Dependencies */
import {MintSubsectionDashboardBalanceChartComponent} from './mint-subsection-dashboard-balance-chart.component';

describe('MintSubsectionDashboardBalanceChartComponent', () => {
	let component: MintSubsectionDashboardBalanceChartComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardBalanceChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardBalanceChartComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('locale', 'en-US');
		fixture.componentRef.setInput('mint_analytics', []);
		fixture.componentRef.setInput('mint_analytics_pre', []);
		fixture.componentRef.setInput('bitcoin_oracle_price_map', null);
		fixture.componentRef.setInput('lightning_balance', null);
		fixture.componentRef.setInput('lightning_analytics_backfill_status', null);
		fixture.componentRef.setInput('lightning_analytics', []);
		fixture.componentRef.setInput('lightning_analytics_pre', []);
		fixture.componentRef.setInput('page_settings', {date_start: 0, date_end: 0, units: [], interval: 'day'});
		fixture.componentRef.setInput('oracle_used', false);
		fixture.componentRef.setInput('mint_genesis_time', 0);
		fixture.componentRef.setInput('selected_type', null);
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('lightning_enabled', false);
		fixture.componentRef.setInput('device_mobile', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
