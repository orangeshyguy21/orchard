/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcBitcoinSubsectionOracleModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/bitcoin-subsection-oracle.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleChartComponent} from './bitcoin-subsection-oracle-chart.component';

describe('BitcoinSubsectionOracleChartComponent', () => {
	let component: BitcoinSubsectionOracleChartComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSubsectionOracleModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleChartComponent);
		component = fixture.componentInstance;

		// set all required inputs using modern signal-based input API
		const now = Math.floor(Date.now() / 1000);
		const one_day = 86400;

		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput('data', []);
		fixture.componentRef.setInput('date_today', now);
		fixture.componentRef.setInput('date_start', now - one_day * 30); // 30 days ago
		fixture.componentRef.setInput('date_end', now);
		fixture.componentRef.setInput('backfill_date_start', null);
		fixture.componentRef.setInput('backfill_date_end', null);
		fixture.componentRef.setInput('form_open', false);
		fixture.componentRef.setInput('enabled_ai', false);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
