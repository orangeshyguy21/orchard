/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed, signal} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-nav-primary-item',
	standalone: false,
	templateUrl: './nav-primary-item.component.html',
	styleUrl: './nav-primary-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPrimaryItemComponent {
	public icon = input.required<string>();
	public name = input.required<string>();
	public mode = input<'default' | 'svg'>('default');
	public navroute = input.required<string>();
	public active = input<boolean>(false);
	public enabled = input<boolean>(false);
	public online = input<boolean>(false);
	public syncing = input<boolean>(false);

	public moused = signal<boolean>(false);

	public highlight = computed(() => this.active() || this.moused());
	public icon_outline = computed(() => `${this.icon()}_outline`);
	public active_svg_icon = computed(() => (this.highlight() ? this.icon() : this.icon_outline()));

	constructor(private router: Router) {}

	public onMouseEnter() {
		this.moused.set(true);
	}

	public onMouseLeave() {
		this.moused.set(false);
	}

	public onClick() {
		this.router.navigate([this.navroute()]);
	}
}
