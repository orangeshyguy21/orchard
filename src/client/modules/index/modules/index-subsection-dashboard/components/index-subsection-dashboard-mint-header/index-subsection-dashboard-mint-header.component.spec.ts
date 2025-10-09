/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionDashboardModule} from '@client/modules/index/modules/index-subsection-dashboard/index-subsection-dashboard.module';
/* Local Dependencies */
import {IndexSubsectionDashboardMintHeaderComponent} from './index-subsection-dashboard-mint-header.component';

describe('IndexSubsectionDashboardMintHeaderComponent', () => {
	let component: IndexSubsectionDashboardMintHeaderComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardMintHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardMintHeaderComponent);
		component = fixture.componentInstance;
		component.enabled = false;
		component.loading = true;
		component.info = {version: ''} as any;
		component.error = false;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
