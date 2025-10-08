/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardEcashHeaderComponent} from './index-subsection-dashboard-ecash-header.component';

describe('IndexSubsectionDashboardEcashHeaderComponent', () => {
	let component: IndexSubsectionDashboardEcashHeaderComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardEcashHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardEcashHeaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardEcashHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
