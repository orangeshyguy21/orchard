/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardLightningHeaderComponent} from './index-subsection-dashboard-lightning-header.component';

describe('IndexSubsectionDashboardLightningHeaderComponent', () => {
	let component: IndexSubsectionDashboardLightningHeaderComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardLightningHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardLightningHeaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardLightningHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
