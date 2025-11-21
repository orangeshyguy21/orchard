/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Shared Dependencies */
import {UtxOracleProgressStatus} from '@shared/generated.types';
/* Native Dependencies */
import {OrcBitcoinSubsectionOracleModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/bitcoin-subsection-oracle.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleRunProgressDateComponent} from './bitcoin-subsection-oracle-run-progress-date.component';

describe('BitcoinSubsectionOracleRunProgressDateComponent', () => {
	let component: BitcoinSubsectionOracleRunProgressDateComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleRunProgressDateComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSubsectionOracleModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleRunProgressDateComponent);
		component = fixture.componentInstance;

		// set all required inputs using modern signal-based input API
		fixture.componentRef.setInput('message', null);
		fixture.componentRef.setInput('progress', null);
		fixture.componentRef.setInput('error', null);
		fixture.componentRef.setInput('status', UtxOracleProgressStatus.Started);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
