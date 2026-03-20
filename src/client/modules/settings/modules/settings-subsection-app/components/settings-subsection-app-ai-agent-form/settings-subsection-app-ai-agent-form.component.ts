/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal, computed} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
import {firstValueFrom, Subscription} from 'rxjs';
/* Application Dependencies */
import {AiService} from '@client/modules/ai/services/ai/ai.service';
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiAgentTool} from '@client/modules/ai/classes/ai-agent-tool.class';
import {AiAgentDefault} from '@client/modules/ai/classes/ai-agent-default.class';
import {buildToolSummary} from '@client/modules/ai/helpers/ai-tool-summary.helper';
import {AiFavorites} from '@client/modules/cache/services/local-storage/local-storage.types';
import {FormPanelRef, FORM_PANEL_DATA} from '@client/modules/form/services/form-panel';
import {FormCronBuilderComponent} from '@client/modules/form/components/form-cron-builder/form-cron-builder.component';
import {Config} from '@client/modules/config/types/config';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {ParsedAppSettings} from '@client/modules/settings/services/setting-app/setting-app.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
/* Native Dependencies */
import {AgentFormMode, ToolSummary} from '@client/modules/settings/modules/settings-subsection-app/types/settings-subsection-app.types';

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
	private readonly dialog = inject(MatDialog);
	private readonly cdr = inject(ChangeDetectorRef);
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
        app_settings: ParsedAppSettings | null;
        config: Config | null;
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
    public tool_gui = signal<{summary: ToolSummary, selected_tools: string[], available_tools: string[]}[]>([]);
    public tools_available = signal<boolean>(false);
    public submitted = signal<boolean>(false);

    /* ── Public computed signals ── */
    public readonly tool_map = computed(() => {
        return new Map(this.data.tools.map((tool) => [tool.name, tool]));
    });
    public readonly available_tool_count = computed(() => {
        return this.tool_gui().reduce((sum, entry) => sum + entry.available_tools.length, 0);
    });
    public readonly form_title = computed(() => {
        if (this.data.mode === 'jobedit') return 'Agent job settings';
        if (this.data.mode === 'jobcreate') return 'New agent job';
        return 'Agent settings';
    });
    /* -- Public properties ── */
    public form: FormGroup;

    /* ── Private fields ── */
    private defaults: AiAgentDefault | null = null;
    private subscriptions = new Subscription();

    constructor() {
        this.ai_favorites.set(this.data.favorites);
        this.fullscreen_system_message.set(this.data.fullscreen_system_message);
        this.is_keyed_agent.set(this.data.agent !== null && this.data.agent?.agent_key !== null);
        switch (this.data.mode) {
            case 'groundskeeper':
                this.form = this.getAgentForm();
                break;
            case 'jobedit':
                this.form = this.getJobEditForm();
                break;
            default:
                this.tools_available.set(true);
                this.form = this.getJobCreateForm();
                break;
        }
        this.tool_gui.set(this.getToolGui());
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
        this.is_default_tools.set(JSON.stringify(this.data.agent?.tools ?? []) === JSON.stringify(this.defaults?.tools ?? []));
    }

    private getAgentForm(): FormGroup {
        if (!this.data.agent || !this.data.agent.agent_key) return new FormGroup({});
        return new FormGroup({
            name: new FormControl(this.data.agent.name, [Validators.required, Validators.maxLength(64)]),
            description: new FormControl(this.data.agent.description, [Validators.required, Validators.maxLength(256)]),
            model: new FormControl(this.data.agent.model, [Validators.required]),
            system_message: new FormControl(this.data.agent.system_message, [Validators.required, Validators.maxLength(4096)]),
            tools: new FormControl(this.data.agent.tools ?? [], [Validators.required]),
        });
    }

    private getJobEditForm(): FormGroup {
        if (!this.data.agent || !this.data.agent.agent_key) return new FormGroup({});
        return new FormGroup({
            name: new FormControl(this.data.agent.name, [Validators.required, Validators.maxLength(64)]),
            description: new FormControl(this.data.agent.description, [Validators.required, Validators.maxLength(256)]),
            active: new FormControl(this.data.agent.active),
            model: new FormControl(this.data.agent.model, [Validators.required]),
            system_message: new FormControl(this.data.agent.system_message, [Validators.required, Validators.maxLength(4096)]),
            tools: new FormControl(this.data.agent.tools ?? [], [Validators.required]),
            schedules: new FormControl(this.data.agent.schedules ?? [], [Validators.required]),
        });
    }

    private getJobCreateForm(): FormGroup {
        return new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.maxLength(64)]),
            description: new FormControl(null, [Validators.required, Validators.maxLength(256)]),
            active: new FormControl(true),
            model: new FormControl(null, [Validators.required]),
            system_message: new FormControl(null, [Validators.required, Validators.maxLength(4096)]),
            tools: new FormControl(null, [Validators.required]),
            schedules: new FormControl(null, [Validators.required]),
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
            this.tool_gui.set(this.getToolGui());
            this.is_default_tools.set(JSON.stringify(value) === JSON.stringify(this.defaults?.tools));
        });
    }

    /* *******************************************************
		Form
	******************************************************** */

    /** Categories banned from the groundskeeper agent */
    private readonly GROUNDSKEEPER_BANNED_CATEGORIES = new Set(['memory', 'message']);

    /** Groups selected tools by category with availability and icon metadata */
    private getToolGui(): {summary: ToolSummary, selected_tools: string[], available_tools: string[]}[] {
        const tool_names: string[] = this.form.get('tools')?.value ?? [];
        const agent = new AiAgent({tools: tool_names} as any);
        const summaries = buildToolSummary(agent, this.data.tools, this.data.app_settings, this.data.config);
        const tool_map = this.tool_map();
        const banned = this.data.mode === 'groundskeeper' ? this.GROUNDSKEEPER_BANNED_CATEGORIES : null;
        const categories = new Map<string, string[]>();
        for (const name of tool_names) {
            const category = tool_map.get(name)?.category ?? 'Uncategorized';
            if (banned?.has(category)) continue;
            categories.set(category, [...(categories.get(category) ?? []), name]);
        }
        const tools_by_category = new Map<string, string[]>();
        for (const tool of this.data.tools) {
            const category = tool.category ?? 'Uncategorized';
            if (banned?.has(category)) continue;
            tools_by_category.set(category, [...(tools_by_category.get(category) ?? []), tool.name]);
        }
        return summaries
            .filter((summary) => !banned?.has(summary.category))
            .map((summary) => {
                const selected = categories.get(summary.category) ?? [];
                const selected_set = new Set(selected);
                return {
                    summary,
                    selected_tools: selected,
                    available_tools: (tools_by_category.get(summary.category) ?? []).filter((name) => !selected_set.has(name)),
                };
            });
    }

    /* *******************************************************
		Actions
	******************************************************** */

    /** Closes the panel with save payload for the parent to handle */
    public onSave(): void {
        this.submitted.set(true);
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        if (this.data.mode === 'jobcreate') {
            this.panelRef.close({mode: 'jobcreate', values: this.form.value});
            return;
        }
        if (!this.data.agent) return;
        const dirty_values: Record<string, unknown> = {};
        for (const key of Object.keys(this.form.controls)) {
            const control = this.form.get(key);
            if (control?.dirty) {
                dirty_values[key] = control.value;
            }
        }
        if (Object.keys(dirty_values).length === 0) {
            this.panelRef.close();
            return;
        }
        this.panelRef.close({mode: this.data.mode, id: this.data.agent.id, values: dirty_values});
    }
    
    public onClose(): void {
        this.panelRef.close();
    }

    /** Reverts a single form field to its original value and marks it pristine */
    public onCancel(event: Event, field: string): void {
        event.preventDefault();
        const control = this.form.get(field);
        if (!control) return;
        const original = (this.data.agent as any)?.[field] ?? null;
        control.setValue(original);
        control.markAsPristine();
    }

    public onActiveChange(active: boolean): void {
        this.form.get('active')?.setValue(active);
        this.form.get('active')?.markAsDirty();
    }

    public onResetSystemMessage(): void {
        this.form.get('system_message')?.setValue(this.defaults?.system_message ?? '');
        this.form.get('system_message')?.markAsDirty();
    }

    public onResetTools(): void {
        this.form.get('tools')?.setValue(this.defaults?.tools ?? []);
        this.form.get('tools')?.markAsDirty();
    }

    public onFullscreenSystemMessage(): void {
        this.fullscreen_system_message.set(!this.fullscreen_system_message());
    }

    public onModelChange(model: string): void {
        this.form.get('model')?.setValue(model);
        this.form.get('model')?.markAsDirty();
    }

    /** Persists updated AI model favorites to local storage */
	public onFavoritesChange(favorites: AiFavorites): void {
		this.ai_favorites.set(favorites);
		this.settingDeviceService.setAiFavorites(favorites);
	}

    /** Opens the cron builder dialog to add a new schedule */
    public onAddSchedule(): void {
        const ref = this.dialog.open(FormCronBuilderComponent, {
            data: {cron: null},
        });
        this.subscriptions.add(
            ref.afterClosed().subscribe((cron: string | undefined) => {
                if (!cron) return;
                const schedules: string[] = this.form.get('schedules')?.value ?? [];
                this.form.get('schedules')?.setValue([...schedules, cron]);
                this.form.get('schedules')?.markAsDirty();
                this.cdr.markForCheck();
            })
        );
    }

    /** Opens the cron builder dialog to edit an existing schedule */
    public onEditSchedule(index: number): void {
        const schedules: string[] = this.form.get('schedules')?.value ?? [];
        const ref = this.dialog.open(FormCronBuilderComponent, {
            data: {cron: schedules[index]},
        });
        this.subscriptions.add(
            ref.afterClosed().subscribe((cron: string | undefined) => {
                if (!cron) return;
                const updated = [...schedules];
                updated[index] = cron;
                this.form.get('schedules')?.setValue(updated);
                this.form.get('schedules')?.markAsDirty();
                this.cdr.markForCheck();
            })
        );
    }

    /** Removes a schedule at the given index */
    public onDeleteSchedule(index: number): void {
        const schedules: string[] = this.form.get('schedules')?.value ?? [];
        this.form.get('schedules')?.setValue(schedules.filter((_: string, i: number) => i !== index));
        this.form.get('schedules')?.markAsDirty();
    }

    /** Removes a tool from the selected tools list */
    public onRemoveTool(tool_name: string): void {
        const tools: string[] = this.form.get('tools')?.value ?? [];
        this.form.get('tools')?.setValue(tools.filter((t: string) => t !== tool_name));
        this.form.get('tools')?.markAsDirty();
    }

    public onAddTool(tool_name: string): void {
        const tools: string[] = this.form.get('tools')?.value ?? [];
        this.form.get('tools')?.setValue([...tools, tool_name]);
        this.form.get('tools')?.markAsDirty();
    }

    public onToggleToolsAvailable(): void {
        this.tools_available.set(!this.tools_available());
        console.log('onAddTool');
        // const tools: string[] = this.form.get('tools')?.value ?? [];
        // this.form.get('tools')?.setValue([...tools, '']);
        // this.form.get('tools')?.markAsDirty();
    }

    /* *******************************************************
		Destroy
	******************************************************** */

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
