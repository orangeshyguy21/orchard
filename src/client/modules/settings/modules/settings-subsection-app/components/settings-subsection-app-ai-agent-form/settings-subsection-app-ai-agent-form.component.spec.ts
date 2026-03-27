/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Application Dependencies */
import {FormPanelRef} from '@client/modules/form/services/form-panel/form-panel-ref';
import {FORM_PANEL_DATA} from '@client/modules/form/services/form-panel/form-panel.types';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
import {SettingsSubsectionAppAiAgentFormComponent} from './settings-subsection-app-ai-agent-form.component';

describe('SettingsSubsectionAppAiAgentFormComponent', () => {
	let component: SettingsSubsectionAppAiAgentFormComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiAgentFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
			providers: [
				{provide: FormPanelRef, useValue: {close: jasmine.createSpy('close')}},
				{provide: FORM_PANEL_DATA, useValue: {mode: 'create', agent: null, models: [], tools: [], device_type: 'desktop', vendor: '', favorites: {ollama: [], openrouter: []}, fullscreen_system_message: false, app_settings: null, config: null}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiAgentFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
