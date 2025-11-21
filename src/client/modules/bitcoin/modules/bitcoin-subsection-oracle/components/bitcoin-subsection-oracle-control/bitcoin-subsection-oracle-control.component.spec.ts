/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Native Dependencies */
import {OrcBitcoinSubsectionOracleModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/bitcoin-subsection-oracle.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleControlComponent} from './bitcoin-subsection-oracle-control.component';

describe('BitcoinSubsectionOracleControlComponent', () => {
	let component: BitcoinSubsectionOracleControlComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSubsectionOracleModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleControlComponent);
		component = fixture.componentInstance;

		// set all required inputs using modern signal-based input API
		const mock_form_group = new FormGroup({
			daterange: new FormGroup({
				date_start: new FormControl(null),
				date_end: new FormControl(null),
			}),
		});
		const min_date = DateTime.utc().minus({years: 1});
		const max_date = DateTime.utc();

		fixture.componentRef.setInput('form_group', mock_form_group);
		fixture.componentRef.setInput('min_date', min_date);
		fixture.componentRef.setInput('max_date', max_date);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
