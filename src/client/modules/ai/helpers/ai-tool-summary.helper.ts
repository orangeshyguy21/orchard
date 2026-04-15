/* Application Dependencies */
import {AiAgent} from '@client/modules/ai/classes/ai-agent.class';
import {AiAgentTool} from '@client/modules/ai/classes/ai-agent-tool.class';
import {ParsedAppSettings} from '@client/modules/settings/types/setting-app.types';
import {Config} from '@client/modules/config/types/config';
/* Native Dependencies */
import {ToolSummary} from '@client/modules/settings/modules/settings-subsection-app/types/settings-subsection-app.types';

const TOOL_ICONS: Record<string, string> = {
	bitcoin: 'bitcoin',
	lightning: 'bolt',
	mint: 'account_balance',
	message: 'send',
	system: 'monitor_heart',
	health: 'health_cross',
	memory: 'network_intelligence',
};

const TOOL_REASONS: Record<string, string> = {
	bitcoin: 'Bitcoin service not configured',
	lightning: 'Lightning service not configured',
	mint: 'Mint service not configured',
	message: 'Messaging not enabled in settings',
	system: 'System metrics not enabled in settings',
};

const CATEGORY_ORDER = ['bitcoin', 'lightning', 'mint', 'system', 'health', 'memory', 'message'];

/** Builds a tool summary chip array from an agent's tools, grouped by category */
export function buildToolSummary(
	agent: AiAgent,
	tools: AiAgentTool[],
	settings: ParsedAppSettings | null,
	config: Config | null,
): ToolSummary[] {
	if (!tools.length) return [];

	const availability: Record<string, boolean> = {
		bitcoin: config?.bitcoin?.enabled ?? false,
		lightning: config?.lightning?.enabled ?? false,
		mint: config?.mint?.enabled ?? false,
		message: settings?.messages_enabled?.value ?? false,
		system: settings?.system_metrics?.value ?? true,
		health: true,
		memory: true,
	};

	const category_map = new Map<string, number>();
	for (const tool of tools) {
		if (!category_map.has(tool.category)) {
			category_map.set(tool.category, 0);
		}
	}
	for (const tool_name of agent.tools) {
		const tool = tools.find((t) => t.name === tool_name);
		if (!tool) continue;
		category_map.set(tool.category, (category_map.get(tool.category) ?? 0) + 1);
	}

	return Array.from(category_map.entries())
		.sort(([a], [b]) => {
			const idx_a = CATEGORY_ORDER.indexOf(a);
			const idx_b = CATEGORY_ORDER.indexOf(b);
			return (idx_a === -1 ? CATEGORY_ORDER.length : idx_a) - (idx_b === -1 ? CATEGORY_ORDER.length : idx_b);
		})
		.map(([category, count]) => {
			const available = availability[category] ?? false;
			return {
				category,
				count,
				available,
				icon: TOOL_ICONS[category] ?? 'build',
				reason: available ? null : (TOOL_REASONS[category] ?? null),
			};
		});
}
