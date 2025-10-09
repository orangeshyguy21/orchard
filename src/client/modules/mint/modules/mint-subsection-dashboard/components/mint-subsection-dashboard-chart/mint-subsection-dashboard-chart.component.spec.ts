/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
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
			providers: [provideLuxonDateAdapter()],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardChartComponent);
		component = fixture.componentInstance;
		component.locale = 'en-US' as any;
		component.mint_analytics = [] as any;
		component.mint_analytics_pre = [] as any;
		component.page_settings = undefined as any;
		component.mint_genesis_time = 0 as any;
		component.selected_type = undefined as any;
		component.loading = true as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
