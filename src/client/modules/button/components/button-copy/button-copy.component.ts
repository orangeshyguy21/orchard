/* Core Dependencies */
import {ChangeDetectionStrategy, Component, ElementRef, input, signal, computed, viewChild} from '@angular/core';

@Component({
	selector: 'orc-button-copy',
	standalone: false,
	templateUrl: './button-copy.component.html',
	styleUrl: './button-copy.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonCopyComponent {
	public text = input.required<string>();
	public label = input<string | null>(null);
	public size = input<string>('lg');

	public copied = signal(false);

	public display = computed(() => {
		return this.label() ?? this.text();
	});

	private icon = viewChild('iconRef', {read: ElementRef});
	private reset_timer: ReturnType<typeof setTimeout> | null = null;

	/** Copies text to clipboard and briefly shows a check icon */
	public onCopy(): void {
		const text = this.text();
		navigator.clipboard.writeText(text);
		if (this.reset_timer) clearTimeout(this.reset_timer);
		this.copied.set(true);
		this.animatePop();
		this.reset_timer = setTimeout(() => {
			this.copied.set(false);
			this.animatePop();
		}, 2000);
	}

	private animatePop(): void {
		const el = this.icon()?.nativeElement;
		if (!el) return;
		for (const anim of el.getAnimations()) anim.cancel();
		el.animate(
			[
				{transform: 'scale(0.2)', opacity: 0.5},
				{transform: 'scale(1)', opacity: 1},
			],
			{duration: 200, easing: 'ease-out', fill: 'both'},
		);
	}
}
