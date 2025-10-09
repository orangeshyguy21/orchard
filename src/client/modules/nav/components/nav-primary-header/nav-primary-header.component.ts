/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, ViewChild, ElementRef, effect} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-nav-primary-header',
	standalone: false,
	templateUrl: './nav-primary-header.component.html',
	styleUrl: './nav-primary-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPrimaryHeaderComponent {
	public active = input.required<boolean>();
	public block_count = input.required<number>();
	public chain = input.required<string>();

	@ViewChild('flash', {read: ElementRef}) flash!: ElementRef<HTMLElement>;

	private polling_blocks: boolean = false;

	constructor(private router: Router) {
		effect(() => {
			const block_count = this.block_count();
			if (!block_count) return;
			if (!this.polling_blocks) {
				setTimeout(() => {
					this.polling_blocks = true;
				}, 1000);
			}
			this.animateFlash();
		});
	}

	private animateFlash(): void {
		if (!this.polling_blocks) return;
		const flash = this.flash.nativeElement;
		for (const anim of flash.getAnimations()) anim.cancel();
		flash
			.animate([{opacity: 1}, {opacity: 0.1}], {duration: 200, easing: 'ease-out', fill: 'forwards'})
			.finished.catch(() => {})
			.finally(() => {
				flash.animate([{opacity: 0.1}, {opacity: 1}], {duration: 400, easing: 'ease-in', fill: 'forwards'});
			});
	}

	public onClick() {
		this.router.navigate(['/']);
	}
}
