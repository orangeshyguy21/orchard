/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledComponent} from './index-subsection-dashboard-bitcoin-enabled.component';

describe('IndexSubsectionDashboardBitcoinEnabledComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardBitcoinEnabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
