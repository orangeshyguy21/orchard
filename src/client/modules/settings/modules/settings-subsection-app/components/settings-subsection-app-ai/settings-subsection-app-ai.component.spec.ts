import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionAppAiComponent} from './settings-subsection-app-ai.component';

describe('SettingsSubsectionAppAiComponent', () => {
	let component: SettingsSubsectionAppAiComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppAiComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
