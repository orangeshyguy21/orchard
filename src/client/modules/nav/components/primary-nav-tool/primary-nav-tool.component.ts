/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-primary-nav-tool',
	standalone: false,
	templateUrl: './primary-nav-tool.component.html',
	styleUrl: './primary-nav-tool.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrimaryNavToolComponent {
	@Input() icon!: string;
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
