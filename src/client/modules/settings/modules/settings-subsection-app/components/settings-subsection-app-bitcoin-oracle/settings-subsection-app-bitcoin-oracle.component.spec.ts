/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppBitcoinOracleComponent} from './settings-subsection-app-bitcoin-oracle.component';

describe('SettingsSubsectionAppBitcoinOracleComponent', () => {
	let component: SettingsSubsectionAppBitcoinOracleComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppBitcoinOracleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppBitcoinOracleComponent);
		component = fixture.componentInstance;

		// set all required inputs using modern signal-based input API
		const mock_form_group = new FormGroup({
			bitcoin_oracle_enabled: new FormControl(false),
		});

		fixture.componentRef.setInput('form_group', mock_form_group);
		fixture.componentRef.setInput('control_name', 'bitcoin_oracle_enabled');
		fixture.componentRef.setInput('oracle_price', null);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
