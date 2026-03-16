import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionAppAiAgentFormComponent} from './settings-subsection-app-ai-agent-form.component';

describe('SettingsSubsectionAppAiAgentFormComponent', () => {
	let component: SettingsSubsectionAppAiAgentFormComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiAgentFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppAiAgentFormComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiAgentFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
