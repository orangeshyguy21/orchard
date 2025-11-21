/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinSubsectionOracleModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/bitcoin-subsection-oracle.module';
/* Native Dependencies */
import {BitcoinSubsectionOracleRunProgressSummaryComponent} from './bitcoin-subsection-oracle-run-progress-summary.component';

describe('BitcoinSubsectionOracleRunProgressSummaryComponent', () => {
	let component: BitcoinSubsectionOracleRunProgressSummaryComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleRunProgressSummaryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSubsectionOracleModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleRunProgressSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
