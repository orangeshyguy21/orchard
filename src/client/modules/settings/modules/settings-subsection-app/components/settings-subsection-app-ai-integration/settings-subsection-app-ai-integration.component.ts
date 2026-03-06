/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input, output, signal, viewChild, ElementRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {DeviceType} from '@client/modules/layout/types/device.types';
import {AiHealth} from '@client/modules/ai/classes/ai-health.class';
import {GraphicStatusState} from '@client/modules/graphic/types/graphic-status.types';

@Component({
	selector: 'orc-settings-subsection-app-ai-integration',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-integration.component.html',
	styleUrl: './settings-subsection-app-ai-integration.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiIntegrationComponent {
	public ai_enabled = input.required<boolean>();
	public ai_health = input.required<AiHealth | null>();
	public form_group = input.required<FormGroup>();
    public selected_vendor = input.required<string>();
    public device_type = input.required<DeviceType>();
    public invalid_ollama_api = input<boolean>(false);
    public invalid_openrouter_key = input<boolean>(false);
	public dirty_ollama_api = input<boolean>(false);
	public dirty_openrouter_key = input<boolean>(false);

    public update = output<void>();
    public submit= output<string>();
    public cancel = output<string>();
    public testConnection = output<void>();

    public ollama_api_control = viewChild<ElementRef<HTMLInputElement>>('ollama_api_control');
    public openrouter_key_control = viewChild<ElementRef<HTMLInputElement>>('openrouter_key_control');

	public help_status = signal<boolean>(false);
    public focused_ollama_api = signal<boolean>(false);
    public focused_openrouter_key = signal<boolean>(false);
    public key_view = signal<boolean>(false);

	public readonly selected_tab_index = computed(() => {
		const vendor = this.selected_vendor();
		return vendor === 'openrouter' ? 1 : 0;
	});
    public readonly show_health = computed(() => {
        const ai_health = this.ai_health();
        if (!ai_health) return false;
        if (ai_health.vendor === this.selected_vendor()) return true;
        return false;
    });
    public readonly health_status = computed(() => {
        const ai_health = this.ai_health();
        if (!ai_health) return 'inactive';
        return ai_health.status ? 'active' : 'inactive';
    });

    public hot_ollama_api = computed(() => {
		return this.focused_ollama_api() || this.dirty_ollama_api();
	});
    public hot_openrouter_key = computed(() => {
		return this.focused_openrouter_key() || this.dirty_openrouter_key();
	});

	/* *******************************************************
		Actions
	******************************************************** */

	/** Toggles the AI enabled form control and emits an update */
	public toggleAIEnabled(status: boolean): void {
		this.form_group().get('enabled')?.setValue(status);
		this.form_group().get('enabled')?.markAsDirty();
		this.form_group().get('enabled')?.markAsTouched();
		this.update.emit();
	}

	/** Handles tab selection to set the AI vendor */
	public onVendorTabChange(index: number): void {
		const vendor = index === 0 ? 'ollama' : 'openrouter';
		this.form_group().get('vendor')?.setValue(vendor);
		this.form_group().get('vendor')?.markAsDirty();
		this.form_group().get('vendor')?.markAsTouched();
		this.update.emit();
	}

	/** Marks a form control as dirty/touched and emits an update */
	public onFieldChange(control_name: string): void {
		const control = this.form_group().get(control_name);
		if (!control) return;
		control.markAsDirty();
		control.markAsTouched();
		this.update.emit();
	}

    public onCancelOllamaApi(event: Event): void {
		event.preventDefault();
		this.cancel.emit('ollama_api');
	}
    public onCancelOpenrouterKey(event: Event): void {
		event.preventDefault();
		this.cancel.emit('openrouter_key');
	}

	public onSubmitOllamaApi(event: Event): void {
		event.preventDefault();
        const control = this.ollama_api_control();
        if (control) control.nativeElement.blur();
        this.submit.emit('ollama_api');
	}
    public onSubmitOpenrouterKey(event: Event): void {
		event.preventDefault();
        const control = this.openrouter_key_control();
        if (control) control.nativeElement.blur();
        this.submit.emit('openrouter_key');
	}
}
