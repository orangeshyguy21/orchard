/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcMintSubsectionDashboardModule} from '@client/modules/mint/modules/mint-subsection-dashboard/mint-subsection-dashboard.module';
/* Local Dependencies */
import {MintSubsectionDashboardChartComponent} from './mint-subsection-dashboard-chart.component';

describe('MintSubsectionDashboardChartComponent', () => {
	let component: MintSubsectionDashboardChartComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardChartComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('locale', 'en-US');
		fixture.componentRef.setInput('bitcoin_oracle_price_map', null);
		fixture.componentRef.setInput('mint_analytics', []);
		fixture.componentRef.setInput('mint_analytics_pre', []);
		fixture.componentRef.setInput('page_settings', undefined);
		fixture.componentRef.setInput('oracle_used', false);
		fixture.componentRef.setInput('mint_genesis_time', 0);
		fixture.componentRef.setInput('selected_type', undefined);
		fixture.componentRef.setInput('loading', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
