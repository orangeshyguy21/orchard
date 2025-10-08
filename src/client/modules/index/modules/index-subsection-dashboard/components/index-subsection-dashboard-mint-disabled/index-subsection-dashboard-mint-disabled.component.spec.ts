/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardMintDisabledComponent} from './index-subsection-dashboard-mint-disabled.component';

describe('IndexSubsectionDashboardMintDisabledComponent', () => {
	let component: IndexSubsectionDashboardMintDisabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardMintDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardMintDisabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardMintDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
