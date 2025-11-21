/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Native Dependencies */
import {OrcBitcoinSubsectionOracleModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/bitcoin-subsection-oracle.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleRunComponent} from './bitcoin-subsection-oracle-run.component';

describe('BitcoinSubsectionOracleRunComponent', () => {
	let component: BitcoinSubsectionOracleRunComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleRunComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSubsectionOracleModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleRunComponent);
		component = fixture.componentInstance;

		// set all required inputs using modern signal-based input API
		const now = DateTime.utc();
		const date_start = now.minus({days: 7});
		const date_end = now.minus({days: 1});

		fixture.componentRef.setInput('date_start', date_start);
		fixture.componentRef.setInput('date_end', date_end);
		fixture.componentRef.setInput('running', false);
		fixture.componentRef.setInput('progress', null);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
