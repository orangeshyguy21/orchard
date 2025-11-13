import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionAppBitcoinOracleComponent} from './settings-subsection-app-bitcoin-oracle.component';

describe('SettingsSubsectionAppBitcoinOracleComponent', () => {
	let component: SettingsSubsectionAppBitcoinOracleComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppBitcoinOracleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppBitcoinOracleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppBitcoinOracleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
