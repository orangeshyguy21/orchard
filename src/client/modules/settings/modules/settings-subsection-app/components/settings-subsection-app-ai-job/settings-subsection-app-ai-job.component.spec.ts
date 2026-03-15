import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionAppAiJobComponent} from './settings-subsection-app-ai-job.component';

describe('SettingsSubsectionAppAiJobComponent', () => {
	let component: SettingsSubsectionAppAiJobComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiJobComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppAiJobComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiJobComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
