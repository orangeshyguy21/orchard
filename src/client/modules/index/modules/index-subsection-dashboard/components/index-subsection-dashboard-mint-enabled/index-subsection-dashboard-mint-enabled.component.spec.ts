/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardMintEnabledComponent} from './index-subsection-dashboard-mint-enabled.component';

describe('IndexSubsectionDashboardMintEnabledComponent', () => {
	let component: IndexSubsectionDashboardMintEnabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardMintEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardMintEnabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardMintEnabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
