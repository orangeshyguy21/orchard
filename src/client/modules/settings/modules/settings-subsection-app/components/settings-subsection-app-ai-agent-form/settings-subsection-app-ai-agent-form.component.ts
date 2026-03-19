/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, computed} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
/* Vendor Dependencies */
import {firstValueFrom, Subscription} from 'rxjs';
/* Application Dependencies */
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiAgentTool} from '@client/modules/ai/classes/ai-agent-tool.class';
import {AiAgentDefault} from '@client/modules/ai/classes/ai-agent-default.class';
import {AiFavorites} from '@client/modules/cache/services/local-storage/local-storage.types';
import {FormPanelRef, FORM_PANEL_DATA} from '@client/modules/form/services/form-panel';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
/* Native Dependencies */
import {AgentFormMode} from '@client/modules/settings/modules/settings-subsection-app/types/settings-subsection-app.types';

@Component({
	selector: 'orc-settings-subsection-app-ai-agent-form',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-agent-form.component.html',
	styleUrl: './settings-subsection-app-ai-agent-form.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiAgentFormComponent implements OnInit, OnDestroy {
	/* ── Injected dependencies ── */
	private readonly panelRef = inject(FormPanelRef);
	private readonly aiService = inject(AiService);
    private readonly settingDeviceService = inject(SettingDeviceService);
	public readonly data: {
        mode: AgentFormMode;
        agent: AiAgent | null;
        models: AiModel[];
        tools: AiAgentTool[];
        device_type: DeviceType;
        vendor: string;
        favorites: AiFavorites;
        fullscreen_system_message: boolean;
    } = inject(FORM_PANEL_DATA);

    /* ── Public signals ── */
    public ai_favorites = signal<AiFavorites>({ollama: [], openrouter: []});
    public focused_name = signal<boolean>(false);
    public focused_description = signal<boolean>(false);
    public focused_system_message = signal<boolean>(false);
    public help_name = signal<boolean>(true);
    public help_description = signal<boolean>(true);
    public help_model = signal<boolean>(true);
    public is_keyed_agent = signal<boolean>(false);
    public is_default_system_message = signal<boolean>(false);
    public is_default_tools = signal<boolean>(false);
    public fullscreen_system_message = signal<boolean>(false);

    /* ── Public computed signals ── */
    public readonly tool_map = computed(() => {
        return new Map(this.data.tools.map((tool) => [tool.name, tool]));
    });

    /* -- Public properties ── */
    public form: FormGroup;

    /* ── Private fields ── */
    private defaults: AiAgentDefault | null = null;
    private subscriptions = new Subscription();

    constructor() {
        console.log('agent form data', this.data);
        this.ai_favorites.set(this.data.favorites);
        this.fullscreen_system_message.set(this.data.fullscreen_system_message);
        this.is_keyed_agent.set(this.data.agent !== null && this.data.agent.agent_key !== null);
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
        if (this.is_keyed_agent()) {
            this.subscriptions.add(this.subSystemMessage());
            this.subscriptions.add(this.subTools());
        }
    }

    /* *******************************************************
		Initialize
	******************************************************** */

    async ngOnInit(): Promise<void> {
        if (!this.data.agent || !this.data.agent.agent_key) return;
        await this.getAiDefaults();
        this.is_default_system_message.set(this.defaults?.system_message === this.form.get('system_message')?.value);
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
		Data
	******************************************************** */

    private async getAiDefaults(): Promise<void> {
        if (!this.data.agent || !this.data.agent.agent_key) return;
        this.defaults = await firstValueFrom(this.aiService.getAiAgentDefaults(this.data.agent.agent_key));
    }

    /* *******************************************************
		Subscriptions
	******************************************************** */

    /** Watches system_message control and updates is_default signal */
    private subSystemMessage(): Subscription | undefined {
        return this.form.get('system_message')?.valueChanges.subscribe((value) => {
            this.is_default_system_message.set(value === this.defaults?.system_message);
        });
    }

    /** Watches tools control and updates is_default signal */
    private subTools(): Subscription | undefined {
        return this.form.get('tools')?.valueChanges.subscribe((value) => {
            this.is_default_tools.set(JSON.stringify(value) === JSON.stringify(this.defaults?.tools));
        });
    }

    /* *******************************************************
		Actions
	******************************************************** */
    
    public onClose(): void {
        this.panelRef.close();
    }

    public onCancel(event: Event): void {
        event.preventDefault();
        console.log('onCancel', event);
        // this.form.reset();
    }

    public onResetSystemMessage(): void {
        this.form.get('system_message')?.setValue(this.defaults?.system_message ?? '');
        this.form.get('system_message')?.markAsDirty();
    }

    public onFullscreenSystemMessage(): void {
        this.fullscreen_system_message.set(!this.fullscreen_system_message());
    }


    /** Persists updated AI model favorites to local storage */
	public onFavoritesChange(favorites: AiFavorites): void {
		this.ai_favorites.set(favorites);
		this.settingDeviceService.setAiFavorites(favorites);
	}

    public onModelChange(model: string): void {
        this.form.get('model')?.setValue(model);
        this.form.get('model')?.markAsDirty();
    }

    /* *******************************************************
		Destroy
	******************************************************** */

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
