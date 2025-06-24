/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
/* Native Dependencies */
import { formatToolName } from '@client/modules/ai/helpers/tool-name-format';
/* Shared Dependencies */
import { OrchardAiAgentTool } from '@shared/generated.types';

@Component({
	selector: 'orc-ai-agent-definition-tool',
	standalone: false,
	templateUrl: './ai-agent-definition-tool.component.html',
	styleUrl: './ai-agent-definition-tool.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAgentDefinitionToolComponent implements OnInit {

	@Input() public tool!: OrchardAiAgentTool;

	public tool_name!: string;

	constructor(
		private readonly cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.tool_name = formatToolName(this.tool.function.name);
	}
}