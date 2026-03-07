/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
/* Native Dependencies */
import {formatToolName} from '@client/modules/ai/helpers/tool-name-format';
/* Shared Dependencies */
import {OrchardAiAssistantTool} from '@shared/generated.types';

@Component({
	selector: 'orc-ai-assistant-definition-tool',
	standalone: false,
	templateUrl: './ai-assistant-definition-tool.component.html',
	styleUrl: './ai-assistant-definition-tool.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiAssistantDefinitionToolComponent implements OnInit {
	@Input() public tool!: OrchardAiAssistantTool;

	public tool_name!: string;
	public tool_expanded: boolean = false;

	constructor(private readonly cdr: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.tool_name = formatToolName(this.tool.function.name);
	}

	public toggleToolDefinition(): void {
		this.tool_expanded = !this.tool_expanded;
		this.cdr.detectChanges();
	}
}
