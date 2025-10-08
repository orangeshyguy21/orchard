import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSectionComponent} from './settings-section.component';

describe('SettingsSectionComponent', () => {
	let component: SettingsSectionComponent;
	let fixture: ComponentFixture<SettingsSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSectionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
