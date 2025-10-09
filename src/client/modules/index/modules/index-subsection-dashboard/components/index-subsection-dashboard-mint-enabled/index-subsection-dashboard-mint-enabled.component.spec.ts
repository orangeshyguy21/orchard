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
		component.loading = true;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
