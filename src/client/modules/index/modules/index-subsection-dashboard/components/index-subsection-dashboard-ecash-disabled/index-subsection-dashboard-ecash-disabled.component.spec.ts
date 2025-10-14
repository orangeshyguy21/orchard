/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardEcashDisabledComponent} from './index-subsection-dashboard-ecash-disabled.component';

describe('IndexSubsectionDashboardEcashDisabledComponent', () => {
	let component: IndexSubsectionDashboardEcashDisabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardEcashDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardEcashDisabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardEcashDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
