/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardLightningEnabledComponent} from './index-subsection-dashboard-lightning-enabled.component';

describe('IndexSubsectionDashboardLightningEnabledComponent', () => {
	let component: IndexSubsectionDashboardLightningEnabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardLightningEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardLightningEnabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardLightningEnabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
