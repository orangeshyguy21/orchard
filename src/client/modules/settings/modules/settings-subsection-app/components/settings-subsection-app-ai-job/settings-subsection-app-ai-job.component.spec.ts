/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
/* Application Dependencies */
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiFavorites} from '@client/modules/cache/services/local-storage/local-storage.types';
/* Native Dependencies */
import {OrcSettingsSubsectionAppModule} from '@client/modules/settings/modules/settings-subsection-app/settings-subsection-app.module';
/* Local Dependencies */
import {SettingsSubsectionAppAiJobComponent} from './settings-subsection-app-ai-job.component';
/* Shared Dependencies */
import {AgentScheduleKind} from '@shared/generated.types';

describe('SettingsSubsectionAppAiJobComponent', () => {
	let component: SettingsSubsectionAppAiJobComponent;
	let fixture: ComponentFixture<SettingsSubsectionAppAiJobComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcSettingsSubsectionAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(SettingsSubsectionAppAiJobComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
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
		Computed: next_run
	******************************************************** */

	it('should return null for next_run when agent is null', () => {
		expect(component.next_run()).toBeNull();
	});

	it('should return null for next_run when agent has no schedules', () => {
		fixture.componentRef.setInput(
			'agent',
			new AiAgent({
				id: '1',
				name: 'Test',
				active: true,
				schedules: [],
				schedule_kind: AgentScheduleKind.Cron,
				created_at: 0,
				updated_at: 0,
			}),
		);
		fixture.detectChanges();
		expect(component.next_run()).toBeNull();
	});

	it('should return a DateTime for next_run when agent has valid schedules', () => {
		fixture.componentRef.setInput(
			'agent',
			new AiAgent({
				id: '1',
				name: 'Test',
				active: true,
				schedules: ['0 * * * *'],
				schedule_kind: AgentScheduleKind.Cron,
				created_at: 0,
				updated_at: 0,
			}),
		);
		fixture.detectChanges();
		expect(component.next_run()).not.toBeNull();
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

	/* *******************************************************
		Actions: onEnabledChange
	******************************************************** */

	it('should not throw when form_group is null on onEnabledChange', () => {
		expect(() => component.onEnabledChange(true)).not.toThrow();
	});

	it('should set active value on the form and emit update', () => {
		const form = new FormGroup({active: new FormControl(false)});
		fixture.componentRef.setInput('form_group', form);
		fixture.detectChanges();

		const spy = spyOn(component.update, 'emit');
		component.onEnabledChange(true);

		expect(form.get('active')?.value).toBe(true);
		expect(form.get('active')?.dirty).toBe(true);
		expect(form.get('active')?.touched).toBe(true);
		expect(spy).toHaveBeenCalled();
	});
});
