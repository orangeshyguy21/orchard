export interface ToolSummary {
	category: string;
	count: number;
	available: boolean;
	icon: string;
	reason: string | null;
}

export type AgentFormMode = 'groundskeeper' | 'jobedit' | 'jobcreate';
