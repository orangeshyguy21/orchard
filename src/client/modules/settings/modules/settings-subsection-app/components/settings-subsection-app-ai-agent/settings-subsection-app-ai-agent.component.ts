/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {DeviceType} from '@client/modules/layout/types/device.types';
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiModel} from '@client/modules/ai/classes/ai-model.class';
import {AiAgentTool} from '@client/modules/ai/classes/ai-agent-tool.class';
import {AiFavorites} from '@client/modules/cache/services/local-storage/local-storage.types';
import {ParsedAppSettings} from '@client/modules/settings/services/setting-app/setting-app.service';
import {Config} from '@client/modules/config/types/config';

@Component({
	selector: 'orc-settings-subsection-app-ai-agent',
	standalone: false,
	templateUrl: './settings-subsection-app-ai-agent.component.html',
	styleUrl: './settings-subsection-app-ai-agent.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppAiAgentComponent {
	/* ── Inputs ── */
	public agent = input<AiAgent | null>(null);
	public tools = input<AiAgentTool[]>([]);
	public app_settings = input<ParsedAppSettings | null>(null);
	public config = input<Config | null>(null);
	public form_group = input<FormGroup | null>(null);
	public model = input<string | null>(null);
	public ai_models = input<AiModel[]>([]);
	public ai_favorites = input<AiFavorites>({ollama: [], openrouter: []});
	public ai_vendor = input<string>('ollama');
	public device_type = input<DeviceType>('desktop');
	public loading = input<boolean>(false);

	/* ── Public computed signals ── */
	public readonly tool_summary = computed(() => {
		const agent = this.agent();
		const tools = this.tools();
		const settings = this.app_settings();
		const config = this.config();
		if (!agent || !tools.length) return [];

		const availability: Record<string, boolean> = {
			bitcoin: config?.bitcoin?.enabled ?? false,
			lightning: config?.lightning?.enabled ?? false,
			mint: config?.mint?.enabled ?? false,
			message: settings?.messages_enabled ?? false,
			system: settings?.system_metrics ?? true,
			health: true,
			memory: true,
		};

		const icons: Record<string, string> = {
			bitcoin: 'bitcoin',
			lightning: 'bolt',
			mint: 'account_balance',
			message: 'send',
			system: 'monitor_heart',
			health: 'health_and_safety',
			memory: 'psychology',
		};

		const reasons: Record<string, string> = {
			bitcoin: 'Bitcoin service not configured',
			lightning: 'Lightning service not configured',
			mint: 'Mint service not configured',
			message: 'Messaging not enabled in settings',
			system: 'System metrics not enabled in settings',
		};

		const category_map = new Map<string, number>();
		for (const tool_name of agent.tools) {
			const tool = tools.find((t) => t.name === tool_name);
			if (!tool) continue;
			category_map.set(tool.category, (category_map.get(tool.category) ?? 0) + 1);
		}

		return Array.from(category_map.entries()).map(([category, count]) => {
			const available = availability[category] ?? false;
			return {
				category,
				count,
				available,
				icon: icons[category] ?? 'build',
				reason: available ? null : (reasons[category] ?? null),
			};
		});
	});

	/* ── Outputs ── */
	public update = output<void>();
	public favoritesChange = output<AiFavorites>();

	/* *******************************************************
		Actions
	******************************************************** */

	/** Handles model selection from the model picker */
	public onModelChange(model: string): void {
		const form = this.form_group();
		if (!form) return;
		form.get('model')?.setValue(model);
		form.get('model')?.markAsDirty();
		this.update.emit();
	}

	/** Bubbles favorites change up to parent */
	public onFavoritesChange(favorites: AiFavorites): void {
		this.favoritesChange.emit(favorites);
	}
}
