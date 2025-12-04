/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal, computed} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-nav-secondary-item',
	standalone: false,
	templateUrl: './nav-secondary-item.component.html',
	styleUrl: './nav-secondary-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavSecondaryItemComponent {
	public name = input.required<string>();
	public navroute = input.required<string>();
	public active = input<boolean>(false);

	public moused = signal<boolean>(false);

	public highlight = computed(() => this.active() || this.moused());

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
