import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionAppBitcoinComponent} from './settings-subsection-app-bitcoin.component';

describe('SettingsSubsectionAppBitcoinComponent', () => {
	let component: SettingsSubsectionAppBitcoinComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppBitcoinComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppBitcoinComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppBitcoinComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
