/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardLightningEnabledInfoComponent} from './index-subsection-dashboard-lightning-enabled-info.component';

describe('IndexSubsectionDashboardLightningEnabledInfoComponent', () => {
	let component: IndexSubsectionDashboardLightningEnabledInfoComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardLightningEnabledInfoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardLightningEnabledInfoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardLightningEnabledInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
