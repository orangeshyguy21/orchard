/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, ViewChild, ElementRef, effect, computed} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-nav-primary-header',
	standalone: false,
	templateUrl: './nav-primary-header.component.html',
	styleUrl: './nav-primary-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPrimaryHeaderComponent {
	public user_name = input<string | null>();
	public active = input.required<boolean>();
	public block_count = input.required<number>();
	public mode = input<'desktop' | 'mobile'>('desktop');

	@ViewChild('flash', {read: ElementRef}) flash!: ElementRef<HTMLElement>;

	public graphic_height = computed(() => (this.mode() === 'mobile' ? '1.5rem' : '3.5rem'));

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
		if (this.mode() === 'mobile') return;
		this.router.navigate(['/']);
	}
}
