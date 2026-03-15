/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
/* Native Dependencies */
import {ToolSummary} from '@client/modules/settings/modules/settings-subsection-app/types/settings-subsection-app.types';

@Component({
	selector: 'orc-settings-subsection-app-ai-tool-chips',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-tool-chips.component.html',
	styleUrl: './settings-subsection-app-ai-tool-chips.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiToolChipsComponent {
	public tools = input<ToolSummary[]>([]);
}
