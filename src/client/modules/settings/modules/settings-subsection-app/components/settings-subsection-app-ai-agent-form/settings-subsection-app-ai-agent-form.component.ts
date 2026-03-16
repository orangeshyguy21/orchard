/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
/* Application Dependencies */
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {FormPanelRef, FORM_PANEL_DATA} from '@client/modules/form/services/form-panel';
/* Native Dependencies */
import {AgentFormMode} from '@client/modules/settings/modules/settings-subsection-app/types/settings-subsection-app.types';

@Component({
	selector: 'orc-settings-subsection-app-ai-agent-form',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-agent-form.component.html',
	styleUrl: './settings-subsection-app-ai-agent-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiAgentFormComponent {
	/* ── Injected dependencies ── */
	private readonly panelRef = inject(FormPanelRef);
	public readonly data: { mode: AgentFormMode; agent: AiAgent } = inject(FORM_PANEL_DATA);
}
