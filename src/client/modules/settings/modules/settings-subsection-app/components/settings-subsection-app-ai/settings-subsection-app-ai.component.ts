/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {DeviceType} from '@client/modules/layout/types/device.types';

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
    public device_type = input.required<DeviceType>();

    public update = output<void>();
    public submit = output<string>();
    public cancel = output<string>();
}
