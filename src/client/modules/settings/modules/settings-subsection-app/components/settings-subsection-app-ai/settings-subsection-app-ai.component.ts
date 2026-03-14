/* Core Dependencies */
import {ChangeDetectionStrategy, Component, DestroyRef, input, output, inject, effect, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {AiHealth} from '@client/modules/ai/classes/ai-health.class';
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
/* Shared Dependencies */
import {AgentKey} from '@shared/generated.types';

@Component({
	selector: 'orc-settings-subsection-app-ai',
	standalone: false,
	templateUrl: './settings-subsection-app-ai.component.html',
	styleUrl: './settings-subsection-app-ai.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiComponent {
	private readonly aiService = inject(AiService);
	private readonly destroyRef = inject(DestroyRef);

	public ai_enabled = input.required<boolean>();
	public form_group_ai = input.required<FormGroup>();
	public form_group_messaging = input.required<FormGroup>();
	public device_type = input.required<DeviceType>();

	public update = output<void>();
	public submit = output<{form: FormGroup; control: string}>();
	public cancel = output<{form: FormGroup; control: string}>();
    public requestAgentForms = output<{agent: AiAgent | null, jobs: AiAgent[]}>();

	public ai_health = signal<AiHealth | null>(null);
    public ai_agent = signal<AiAgent | null>(null);
    public ai_jobs = signal<AiAgent[]>([]);
    public loading_health = signal<boolean>(false);
    public loading_agents = signal<boolean>(false);

    private initialized_health: boolean = false;
    private initialized_agents: boolean = false;

	constructor() {
		effect(() => {
            const ai_enabled = this.ai_enabled();
            if (ai_enabled && !this.initialized_agents) this.getAiAgents();
			if (ai_enabled && !this.initialized_health) this.getAiHealth();
		});
	}

	private getAiHealth(): void {
        this.initialized_health = true;
        this.loading_health.set(true);
		this.aiService
			.getAiHealth()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (health: AiHealth) => {
					this.ai_health.set(health);
					this.loading_health.set(false);
				},
				error: () => {
					this.ai_health.set(null);
					this.loading_health.set(false);
				},
			});
	}

    private getAiAgents(): void {
        this.initialized_agents = true;
        this.loading_agents.set(true);
        this.aiService
            .getAiAgents()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (agents: AiAgent[]) => {
                    this.ai_agent.set(agents.find((agent) => agent.agent_key === AgentKey.Groundskeeper) ?? null);
                    this.ai_jobs.set(agents.filter((agent) => agent.agent_key !== AgentKey.Groundskeeper));
                    this.requestAgentForms.emit({agent: this.ai_agent(), jobs: this.ai_jobs()});
                    this.loading_agents.set(false);
                },
                error: () => {
                    this.ai_jobs.set([]);
                    this.ai_agent.set(null);
                    this.loading_agents.set(false);
                },
            });
    }

    public onTestConnection(): void {
        this.getAiHealth();
    }
}
