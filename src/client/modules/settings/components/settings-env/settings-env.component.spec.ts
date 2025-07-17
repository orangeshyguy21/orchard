import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsEnvComponent} from './settings-env.component';

describe('SettingsEnvComponent', () => {
	let component: SettingsEnvComponent;
	let fixture: ComponentFixture<SettingsEnvComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsEnvComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsEnvComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
