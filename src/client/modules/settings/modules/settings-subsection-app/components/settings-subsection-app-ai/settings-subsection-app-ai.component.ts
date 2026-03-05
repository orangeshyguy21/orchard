/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
	selector: 'orc-settings-subsection-app-ai',
	standalone: false,
	templateUrl: './settings-subsection-app-ai.component.html',
	styleUrl: './settings-subsection-app-ai.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiComponent {
	public ai_enabled = input.required<boolean>();
	public form_group = input.required<FormGroup>();

    public update = output<void>();
}
