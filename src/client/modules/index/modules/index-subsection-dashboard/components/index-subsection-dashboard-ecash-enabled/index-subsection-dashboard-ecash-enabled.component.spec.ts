/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardEcashEnabledComponent} from './index-subsection-dashboard-ecash-enabled.component';

describe('IndexSubsectionDashboardEcashEnabledComponent', () => {
	let component: IndexSubsectionDashboardEcashEnabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardEcashEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardEcashEnabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardEcashEnabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
