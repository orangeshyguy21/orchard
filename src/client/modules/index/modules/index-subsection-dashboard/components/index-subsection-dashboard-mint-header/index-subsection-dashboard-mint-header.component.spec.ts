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
		fixture.componentRef.setInput('enabled', false);
		fixture.componentRef.setInput('loading', true);
		fixture.componentRef.setInput('info', {version: ''});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
