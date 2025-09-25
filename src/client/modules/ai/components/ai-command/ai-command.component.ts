/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, Output, EventEmitter, ViewChild, ElementRef, effect} from '@angular/core';

@Component({
	selector: 'orc-ai-command',
	standalone: false,
	templateUrl: './ai-command.component.html',
	styleUrl: './ai-command.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiCommandComponent {
	public actionable = input.required<boolean>();
	public active_chat = input.required<boolean>();

	@Output() command = new EventEmitter<void>();

	@ViewChild('icon', {read: ElementRef}) icon!: ElementRef<HTMLElement>;

	constructor() {
		effect(() => {
			this.active_chat();
			this.playPop();
		});
	}

	private playPop(): void {
		const el = this.icon?.nativeElement;
		if (!el) return;
		for (const anim of el.getAnimations()) anim.cancel();
		el.animate(
			[
				{transform: 'scale(0.8)', opacity: 0.5},
				{transform: 'scale(1)', opacity: 1},
			],
			{duration: 200, easing: 'ease-out', fill: 'both'},
		);
	}
}
