/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Native Dependencies */
import {OrcBitcoinSubsectionOracleModule} from '@client/modules/bitcoin/modules/bitcoin-subsection-oracle/bitcoin-subsection-oracle.module';
/* Local Dependencies */
import {BitcoinSubsectionOracleFormComponent} from './bitcoin-subsection-oracle-form.component';

describe('BitcoinSubsectionOracleFormComponent', () => {
	let component: BitcoinSubsectionOracleFormComponent;
	let fixture: ComponentFixture<BitcoinSubsectionOracleFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcBitcoinSubsectionOracleModule],
		}).compileComponents();

		fixture = TestBed.createComponent(BitcoinSubsectionOracleFormComponent);
		component = fixture.componentInstance;

		// set all required inputs using modern signal-based input API
		const mock_form_group = new FormGroup({
			date_start: new FormControl(null),
			date_end: new FormControl(null),
		});
		const now = DateTime.utc();
		const min_date = now.minus({years: 1});
		const max_date = now.minus({days: 1});

		fixture.componentRef.setInput('form_group', mock_form_group);
		fixture.componentRef.setInput('running', false);
		fixture.componentRef.setInput('progress', null);
		fixture.componentRef.setInput('min_date', min_date);
		fixture.componentRef.setInput('max_date', max_date);
		fixture.componentRef.setInput('date_start_max', max_date);
		fixture.componentRef.setInput('date_end_min', min_date);
		fixture.componentRef.setInput('device_mobile', true);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
