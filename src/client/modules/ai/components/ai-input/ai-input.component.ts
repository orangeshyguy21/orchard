/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
/* Shared Dependencies */
import { AiAgent } from '@shared/generated.types';

@Component({
	selector: 'orc-ai-input',
	standalone: false,
	templateUrl: './ai-input.component.html',
	styleUrl: './ai-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiInputComponent {

	@Input() active_chat!: boolean;
	@Input() active_agent!: AiAgent;
	@Input() model!: string | null;
	@Input() content!: FormControl;

	@Output() chat = new EventEmitter<void>();

	public get placeholder(): string {
		return this.active_chat ? 'Generating...' : 'Message agent...';
	}

	constructor() {}

	public onSubmit(event?: any): void {
		if( event ) event.preventDefault();
		this.chat.emit();
	}
}
