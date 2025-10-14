/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatIconTestingModule} from '@angular/material/icon/testing';
/* Native Dependencies */
import {OrcBitcoinSubsectionDashboardModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-dashboard/bitcoin-subsection-dashboard.module';
/* Local Dependencies */
import {BitcoinSubsectionDashboardComponent} from './bitcoin-subsection-dashboard.component';

describe('BitcoinSubsectionDashboardComponent', () => {
	let component: BitcoinSubsectionDashboardComponent;
	let fixture: ComponentFixture<BitcoinSubsectionDashboardComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MatIconTestingModule, OrcBitcoinSubsectionDashboardModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionDashboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
