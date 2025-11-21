/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppBitcoinComponent} from './settings-subsection-app-bitcoin.component';

describe('SettingsSubsectionAppBitcoinComponent', () => {
	let component: SettingsSubsectionAppBitcoinComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppBitcoinComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppBitcoinComponent);
		component = fixture.componentInstance;

		// set all required inputs using modern signal-based input API
		const mock_form_group = new FormGroup({
			oracle_enabled: new FormControl(false),
		});

		fixture.componentRef.setInput('form_group', mock_form_group);
		fixture.componentRef.setInput('oracle_price', null);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
