/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Shared Dependencies */
import {UtxOracleProgressStatus} from '@shared/generated.types';
/* Native Dependencies */
import {OrcBitcoinSubsectionOracleModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/bitcoin-subsection-oracle.module';
/* Local Dependencies */
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

		// set all required inputs using modern signal-based input API
		const now = Math.floor(Date.now() / 1000);

		fixture.componentRef.setInput('date', now);
		fixture.componentRef.setInput('progress', 0);
		fixture.componentRef.setInput('successful', 0);
		fixture.componentRef.setInput('failed', 0);
		fixture.componentRef.setInput('status', UtxOracleProgressStatus.Started);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
