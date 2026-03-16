/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
/* Application Dependencies */
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiAgentTool} from '@client/modules/ai/classes/ai-agent-tool.class';
import {AiAgentDefault} from '@client/modules/ai/classes/ai-agent-default.class';
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
export class SettingsSubsectionAppAiAgentFormComponent implements OnInit {
	/* ── Injected dependencies ── */
	private readonly panelRef = inject(FormPanelRef);
	private readonly aiService = inject(AiService);
	public readonly data: { mode: AgentFormMode; agent: AiAgent | null; tools: AiAgentTool[] } = inject(FORM_PANEL_DATA);

    /* -- Public properties ── */
    public form: FormGroup;

    /* ── Private fields ── */
    private defaults: AiAgentDefault | null = null;

    constructor() {
        switch (this.data.mode) {
            case 'groundskeeper':
                this.form = this.getAgentForm();
                break;
            case 'jobedit':
                this.form = this.getJobEditForm();
                break;
            default:
                this.form = this.getJobCreateForm();
                break;
        }
    }

    /* *******************************************************
		Initialize
	******************************************************** */

    ngOnInit(): void {
        if (!this.data.agent || !this.data.agent.agent_key) return;
        this.aiService.getAiAgentDefaults(this.data.agent.agent_key).subscribe((defaults) => {
            this.defaults = defaults;
        });
    }

    private getAgentForm(): FormGroup {
        if (!this.data.agent || !this.data.agent.agent_key) return new FormGroup({});
        return new FormGroup({
            name: new FormControl(this.data.agent.name),
            description: new FormControl(this.data.agent.description),
            model: new FormControl(this.data.agent.model),
            system_message: new FormControl(this.data.agent.system_message),
            tools: new FormControl(this.data.agent.tools ?? []),
        });
    }

    private getJobEditForm(): FormGroup {
        if (!this.data.agent || !this.data.agent.agent_key) return new FormGroup({});
        return new FormGroup({
            name: new FormControl(this.data.agent.name),
            description: new FormControl(this.data.agent.description),
            active: new FormControl(this.data.agent.active),
            model: new FormControl(this.data.agent.model),
            system_message: new FormControl(this.data.agent.system_message),
            tools: new FormControl(this.data.agent.tools ?? []),
            schedules: new FormControl(this.data.agent.schedules ?? []),
        });
    }

    private getJobCreateForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(),
            description: new FormControl(),
            active: new FormControl(),
            model: new FormControl(),
            system_message: new FormControl(),
            tools: new FormControl([]),
            schedules: new FormControl([]),
        });
    }

     /* *******************************************************
		Actions
	******************************************************** */
    
    public onClose(): void {
        this.panelRef.close();
    }
}


// /* Shared Dependencies */
// import {OrchardAgent, AgentKey, AgentRunStatus} from '@shared/generated.types';

// export class AiAgent implements OrchardAgent {
// 	id: string;
// 	agent_key: AgentKey | null;
// 	name: string;
// 	description: string | null;
// 	active: boolean;
// 	model: string | null;
// 	system_message: string | null;
// 	tools: string[];
// 	schedules: string[];
// 	last_run_at: number | null;
// 	last_run_status: AgentRunStatus | null;
// 	created_at: number;
// 	updated_at: number;

// 	constructor(agent: OrchardAgent) {
// 		this.id = agent.id;
// 		this.agent_key = agent.agent_key ?? null;
// 		this.name = agent.name;
// 		this.description = agent.description ?? null;
// 		this.active = agent.active;
// 		this.model = agent.model ?? null;
// 		this.system_message = agent.system_message ?? null;
// 		this.tools = agent.tools ?? [];
// 		this.schedules = agent.schedules;
// 		this.last_run_at = agent.last_run_at ?? null;
// 		this.last_run_status = agent.last_run_status ?? null;
// 		this.created_at = agent.created_at;
// 		this.updated_at = agent.updated_at;
// 	}
// }
