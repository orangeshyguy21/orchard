import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsSubsectionAppAiAgentComponent} from './settings-subsection-app-ai-agent.component';

describe('SettingsSubsectionAppAiAgentComponent', () => {
	let component: SettingsSubsectionAppAiAgentComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiAgentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SettingsSubsectionAppAiAgentComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiAgentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
