import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionDeviceCurrencyComponent} from './settings-subsection-device-currency.component';

describe('SettingsSubsectionDeviceCurrencyComponent', () => {
	let component: SettingsSubsectionDeviceCurrencyComponent;
	let fixture: ComponentFixture<SettingsSubsectionDeviceCurrencyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionDeviceCurrencyComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionDeviceCurrencyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
