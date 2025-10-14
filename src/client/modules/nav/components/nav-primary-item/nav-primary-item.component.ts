import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-nav-primary-item',
	standalone: false,
	templateUrl: './nav-primary-item.component.html',
	styleUrl: './nav-primary-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPrimaryItemComponent {
	@Input() icon!: string;
	@Input() name!: string;
	@Input() mode: 'default' | 'svg' = 'default';
	@Input() navroute!: string;
	@Input() active: boolean = false;
	@Input() enabled!: boolean;
	@Input() online!: boolean;
	@Input() syncing!: boolean;

	public moused = false;

	public get highlight() {
		return this.active || this.moused;
	}
	public get icon_outline() {
		return `${this.icon}_outline`;
	}
	public get active_svg_icon() {
		return this.highlight ? this.icon : this.icon_outline;
	}
	public get indicator_class(): string {
		if (!this.enabled) return '';
		if (this.online === false) return 'trans-bg-medium orc-status-inactive-bg';
		if (this.syncing) return 'trans-bg-medium orc-status-warning-bg';
		if (this.online === true) return 'trans-bg-medium orc-status-active-bg';
		return 'orc-animation-shimmer-highest';
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
