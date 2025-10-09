/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardLightningEnabledComponent} from './index-subsection-dashboard-lightning-enabled.component';

describe('IndexSubsectionDashboardLightningEnabledComponent', () => {
	let component: IndexSubsectionDashboardLightningEnabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardLightningEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardLightningEnabledComponent);
		component = fixture.componentInstance;
		component.loading = true;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
