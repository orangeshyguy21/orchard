import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsTimeLocaleComponent} from './settings-time-locale.component';

describe('SettingsTimeLocaleComponent', () => {
	let component: SettingsTimeLocaleComponent;
	let fixture: ComponentFixture<SettingsTimeLocaleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsTimeLocaleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsTimeLocaleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
