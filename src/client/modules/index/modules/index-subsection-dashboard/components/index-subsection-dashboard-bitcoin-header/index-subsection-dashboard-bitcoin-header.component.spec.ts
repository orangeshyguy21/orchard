/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinHeaderComponent} from './index-subsection-dashboard-bitcoin-header.component';

describe('IndexSubsectionDashboardBitcoinHeaderComponent', () => {
	let component: IndexSubsectionDashboardBitcoinHeaderComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardBitcoinHeaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
