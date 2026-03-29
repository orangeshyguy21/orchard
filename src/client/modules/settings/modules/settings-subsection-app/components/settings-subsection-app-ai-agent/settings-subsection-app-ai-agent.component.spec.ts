/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
/* Shared Dependencies */
import {AgentScheduleKind} from '@shared/generated.types';
/* Application Dependencies */
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiFavorites} from '@client/modules/cache/services/local-storage/local-storage.types';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppAiAgentComponent} from './settings-subsection-app-ai-agent.component';

/** Helper to build a minimal AiAgent for testing */
function mockAgent(overrides: Partial<AiAgent> = {}): AiAgent {
	return new AiAgent({
		id: 'agent-1',
		name: 'Groundskeeper',
		active: true,
		schedules: [],
		schedule_kind: AgentScheduleKind.Cron,
		created_at: 0,
		updated_at: 0,
		...overrides,
	});
}

describe('SettingsSubsectionAppAiAgentComponent', () => {
	let component: SettingsSubsectionAppAiAgentComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiAgentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiAgentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	/* *******************************************************
		Computed: highlighted_system_message
	******************************************************** */

	it('should return empty string when agent is null', () => {
		expect(component.highlighted_system_message()).toBe('');
	});

	it('should return empty string when agent has no system_message', () => {
		fixture.componentRef.setInput('agent', mockAgent({system_message: null}));
		fixture.detectChanges();
		expect(component.highlighted_system_message()).toBe('');
	});

	it('should return tokenized markdown when agent has a system_message', () => {
		fixture.componentRef.setInput('agent', mockAgent({system_message: 'Hello **world**'}));
		fixture.detectChanges();
		expect(component.highlighted_system_message()).toContain('Hello');
	});

	/* *******************************************************
		Computed: model_warning
	******************************************************** */

	it('should return true for model_warning when model is null', () => {
		expect(component.model_warning()).toBe(true);
	});

	it('should return true for model_warning when model is not in ai_models list', () => {
		fixture.componentRef.setInput('model', 'unknown-model');
		fixture.componentRef.setInput('ai_models', [new AiModel({model: 'llama3', name: 'Llama 3', context_length: 8192})]);
		fixture.detectChanges();
		expect(component.model_warning()).toBe(true);
	});

	it('should return false for model_warning when model exists in ai_models list', () => {
		fixture.componentRef.setInput('model', 'llama3');
		fixture.componentRef.setInput('ai_models', [new AiModel({model: 'llama3', name: 'Llama 3', context_length: 8192})]);
		fixture.detectChanges();
		expect(component.model_warning()).toBe(false);
	});

	/* *******************************************************
		Actions: onModelChange
	******************************************************** */

	it('should not throw when form_group is null on onModelChange', () => {
		expect(() => component.onModelChange('llama3')).not.toThrow();
	});

	it('should set the model value on the form and emit update', () => {
		const form = new FormGroup({model: new FormControl('')});
		fixture.componentRef.setInput('form_group', form);
		fixture.detectChanges();

		const spy = spyOn(component.update, 'emit');
		component.onModelChange('llama3');

		expect(form.get('model')?.value).toBe('llama3');
		expect(form.get('model')?.dirty).toBe(true);
		expect(spy).toHaveBeenCalled();
	});

	/* *******************************************************
		Actions: onFavoritesChange
	******************************************************** */

	it('should emit favoritesChange with the given favorites', () => {
		const spy = spyOn(component.favoritesChange, 'emit');
		const favorites: AiFavorites = {ollama: ['llama3'], openrouter: []};
		component.onFavoritesChange(favorites);
		expect(spy).toHaveBeenCalledWith(favorites);
	});
});
