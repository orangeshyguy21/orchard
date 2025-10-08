/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexSubsectionDashboardBitcoinEnabledHotwalletComponent} from './index-subsection-dashboard-bitcoin-enabled-hotwallet.component';

describe('IndexSubsectionDashboardBitcoinEnabledHotwalletComponent', () => {
	let component: IndexSubsectionDashboardBitcoinEnabledHotwalletComponent;
	let fixture: ComponentFixture<IndexSubsectionDashboardBitcoinEnabledHotwalletComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexSubsectionDashboardBitcoinEnabledHotwalletComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionDashboardBitcoinEnabledHotwalletComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
