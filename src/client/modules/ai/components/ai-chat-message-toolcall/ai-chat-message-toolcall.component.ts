/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
/* Vendor Dependencies */
import { MatTableDataSource } from '@angular/material/table';
/* Native Dependencies */
import { AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
/* Local Dependencies */
import { ArgumentRow } from './argument-row.class';

@Component({
	selector: 'orc-ai-chat-message-toolcall',
	standalone: false,
	templateUrl: './ai-chat-message-toolcall.component.html',
	styleUrl: './ai-chat-message-toolcall.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('expandCollapse', [
            state('collapsed', style({
                height: '0',
                overflow: 'hidden',
                opacity: 0
            })),
            state('expanded', style({
                height: '*',
                overflow: 'visible',
                opacity: 1
            })),
            transition('collapsed <=> expanded', [
                animate('300ms ease-in-out')
            ])
        ]),
        trigger('rotateIcon', [
            state('collapsed', style({
                transform: 'rotate(0deg)'
            })),
            state('expanded', style({
                transform: 'rotate(180deg)'
            })),
            transition('collapsed <=> expanded', [
                animate('300ms ease-in-out')
            ])
        ])
    ]
})
export class AiChatMessageToolcallComponent implements OnInit {

	@Input() tool_call!: AiChatToolCall;

	public tool_title!: string;
	public tool_expanded: boolean = false;
	public displayed_columns = ['field', 'value'];
	public data_source!: MatTableDataSource<ArgumentRow>;

	constructor(
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.tool_title = this.formatToolName(this.tool_call.function.name);
		const arguments_rows = Object.entries(this.tool_call.function.arguments).map(([field, value]) => new ArgumentRow(field, value));
		this.data_source = new MatTableDataSource(arguments_rows);
	}

	private formatToolName(tool_name: string): string {
		return tool_name
			.split('_')
			.map(word => word.toLowerCase())
			.join(' ')
			.replace(/^\w/, c => c.toUpperCase());
	}

	public toggleToolDetails(): void {
		this.tool_expanded = !this.tool_expanded;
		this.cdr.detectChanges();
	}
}