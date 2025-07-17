import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsTimeComponent} from './settings-time.component';

describe('SettingsTimeComponent', () => {
	let component: SettingsTimeComponent;
	let fixture: ComponentFixture<SettingsTimeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsTimeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsTimeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
