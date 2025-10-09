/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardMintEnabledInfoComponent} from './index-subsection-dashboard-mint-enabled-info.component';

describe('IndexSubsectionDashboardMintEnabledInfoComponent', () => {
	let component: IndexSubsectionDashboardMintEnabledInfoComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardMintEnabledInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardMintEnabledInfoComponent);
		component = fixture.componentInstance;
		component.loading = true;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
