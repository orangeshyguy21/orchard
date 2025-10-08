/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardLightningDisabledComponent} from './index-subsection-dashboard-lightning-disabled.component';

describe('IndexSubsectionDashboardLightningDisabledComponent', () => {
	let component: IndexSubsectionDashboardLightningDisabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardLightningDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardLightningDisabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardLightningDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
