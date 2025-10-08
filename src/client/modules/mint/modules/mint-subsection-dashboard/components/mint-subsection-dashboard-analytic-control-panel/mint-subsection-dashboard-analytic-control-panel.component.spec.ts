/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionDashboardAnalyticControlPanelComponent} from './mint-subsection-dashboard-analytic-control-panel.component';

describe('MintSubsectionDashboardAnalyticControlPanelComponent', () => {
	let component: MintSubsectionDashboardAnalyticControlPanelComponent;
	let fixture: ComponentFixture<MintSubsectionDashboardAnalyticControlPanelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDashboardAnalyticControlPanelComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDashboardAnalyticControlPanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
