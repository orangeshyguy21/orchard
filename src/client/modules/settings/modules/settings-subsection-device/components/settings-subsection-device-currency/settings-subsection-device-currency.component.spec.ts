/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ComponentRef} from '@angular/core';
/* Native Dependencies */
import {OrcSettingsSubsectionDeviceModule} from '@client/modules/settings/modules/settings-subsection-device/settings-subsection-device.module';
import {CurrencyType} from '@client/modules/cache/services/local-storage/local-storage.types';
/* Local Dependencies */
import {SettingsSubsectionDeviceCurrencyComponent} from './settings-subsection-device-currency.component';

describe('SettingsSubsectionDeviceCurrencyComponent', () => {
	let component: SettingsSubsectionDeviceCurrencyComponent;
	let componentRef: ComponentRef<SettingsSubsectionDeviceCurrencyComponent>;
	let fixture: ComponentFixture<SettingsSubsectionDeviceCurrencyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionDeviceModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceCurrencyComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;

		componentRef.setInput('currency', {type_btc: CurrencyType.GLYPH, type_fiat: CurrencyType.CODE});
		componentRef.setInput('loading', false);
		componentRef.setInput('mode', 'type_btc');
		componentRef.setInput('locale', 'en-US');

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
