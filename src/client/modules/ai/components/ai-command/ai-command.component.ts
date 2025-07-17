/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, Output, EventEmitter} from '@angular/core';
import {trigger, transition, style, animate} from '@angular/animations';
@Component({
	selector: 'orc-ai-command',
	standalone: false,
	templateUrl: './ai-command.component.html',
	styleUrl: './ai-command.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// prettier-ignore
	animations: [
		trigger('iconAnimation', [
			transition('* => *', [
				style({ transform: 'scale(0.8)', opacity: 0.5 }),
				animate('200ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
			]),
		]),
	],
})
export class AiCommandComponent {
	@Input() actionable!: boolean;
	@Input() active_chat!: boolean;

	@Output() command = new EventEmitter<void>();
}
