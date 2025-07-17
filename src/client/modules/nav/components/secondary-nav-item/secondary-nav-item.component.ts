/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-secondary-nav-item',
	standalone: false,
	templateUrl: './secondary-nav-item.component.html',
	styleUrl: './secondary-nav-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecondaryNavItemComponent {
	@Input() name!: string;
	@Input() navroute!: string;
	@Input() active: boolean = false;

	public moused = false;

	public get highlight() {
		return this.active || this.moused;
	}

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private router: Router,
	) {}

	public onMouseEnter() {
		this.moused = true;
		this.changeDetectorRef.detectChanges();
	}

	public onMouseLeave() {
		this.moused = false;
		this.changeDetectorRef.detectChanges();
	}

	public onClick() {
		this.router.navigate([this.navroute]);
	}
}
