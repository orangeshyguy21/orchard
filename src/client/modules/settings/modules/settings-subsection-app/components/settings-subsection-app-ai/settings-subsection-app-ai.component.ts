/* Core Dependencies */
import {ChangeDetectionStrategy, Component, DestroyRef, input, output, inject, effect, signal, computed} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {AiHealth} from '@client/modules/ai/classes/ai-health.class';
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiAgentTool} from '@client/modules/ai/classes/ai-agent-tool.class';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {AiFavorites} from '@client/modules/cache/services/local-storage/local-storage.types';
import {ParsedAppSettings} from '@client/modules/settings/services/setting-app/setting-app.service';
import {Config} from '@client/modules/config/types/config';
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
	private readonly settingDeviceService = inject(SettingDeviceService);
	private readonly destroyRef = inject(DestroyRef);

	public ai_enabled = input.required<boolean>();
	public app_settings = input<ParsedAppSettings | null>(null);
	public config = input<Config | null>(null);
	public form_group_ai = input.required<FormGroup>();
	public form_group_messaging = input.required<FormGroup>();
	public agents = input<Map<string, AiAgent>>(new Map());
	public agent_form_groups = input<Map<string, FormGroup>>(new Map());
	public device_type = input.required<DeviceType>();

	public update = output<void>();
	public submit = output<{form: FormGroup; control: string}>();
	public cancel = output<{form: FormGroup; control: string}>();
	public requestAgentForms = output<AiAgent[]>();

	public ai_health = signal<AiHealth | null>(null);
	public ai_models = signal<AiModel[]>([]);
    public ai_agent_tools = signal<AiAgentTool[]>([]);
	public ai_favorites = signal<AiFavorites>({ollama: [], openrouter: []});
	public loading_health = signal<boolean>(false);
	public loading_agents = signal<boolean>(false);

	public readonly groundskeeper = computed<AiAgent | null>(() => {
		for (const agent of this.agents().values()) {
			if (agent.agent_key === AgentKey.Groundskeeper) return agent;
		}
		return null;
	});

	public readonly groundskeeper_form = computed<FormGroup | null>(() => {
		const agent = this.groundskeeper();
		if (!agent) return null;
		return this.agent_form_groups().get(agent.id) ?? null;
	});

	private initialized_health: boolean = false;
	private initialized_agents: boolean = false;

	constructor() {
		effect(() => {
			const ai_enabled = this.ai_enabled();
			if (ai_enabled && !this.initialized_agents) this.getAiDatas();
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

    private getAiDatas(): void {
        this.getAiAgents();
        this.getAiAgentTools();
        this.getAiModels();
        this.ai_favorites.set(this.settingDeviceService.getAiFavorites());
    }

	private getAiAgents(): void {
		this.initialized_agents = true;
		this.loading_agents.set(true);
		this.aiService
			.getAiAgents()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (agents: AiAgent[]) => {
					this.requestAgentForms.emit(agents);
					this.loading_agents.set(false);
				},
				error: () => {
					this.loading_agents.set(false);
				},
			});
	}

    private getAiModels(): void {
        this.aiService
            .getAiModels()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (models: AiModel[]) => this.ai_models.set(models),
                error: () => this.ai_models.set([]),
            });
    }

    private getAiAgentTools(): void {
        this.aiService
            .getAiAgentTools()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (tools: AiAgentTool[]) => this.ai_agent_tools.set(tools),
                error: () => this.ai_agent_tools.set([]),
            });
    }



	public onTestConnection(): void {
		this.getAiHealth();
	}

	/** Persists updated AI model favorites to local storage */
	public onFavoritesChange(favorites: AiFavorites): void {
		this.ai_favorites.set(favorites);
		this.settingDeviceService.setAiFavorites(favorites);
	}
}
