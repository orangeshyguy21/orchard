/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-settings-subsection-app-ai-integration',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-integration.component.html',
	styleUrl: './settings-subsection-app-ai-integration.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiIntegrationComponent {
    public ai_enabled = input.required<boolean>();
    public form_group = input.required<FormGroup>();

    public help_status = signal<boolean>(false);

    public update = output<void>();

	/** Toggles the oracle form control and emits an update */
	public toggleAIEnabled(status: boolean): void {
		this.form_group().get('enabled')?.setValue(status);
		this.form_group().get('enabled')?.markAsDirty();
		this.form_group().get('enabled')?.markAsTouched();
        this.update.emit();
	}
}
