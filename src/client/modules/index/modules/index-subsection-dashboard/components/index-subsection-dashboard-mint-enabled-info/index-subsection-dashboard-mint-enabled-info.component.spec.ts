/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardMintEnabledInfoComponent} from './index-subsection-dashboard-mint-enabled-info.component';

describe('IndexSubsectionDashboardMintEnabledInfoComponent', () => {
	let component: IndexSubsectionDashboardMintEnabledInfoComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardMintEnabledInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardMintEnabledInfoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardMintEnabledInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
