/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinDisabledComponent} from './index-subsection-dashboard-bitcoin-disabled.component';

describe('IndexSubsectionDashboardBitcoinDisabledComponent', () => {
	let component: IndexSubsectionDashboardBitcoinDisabledComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinDisabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardBitcoinDisabledComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinDisabledComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
