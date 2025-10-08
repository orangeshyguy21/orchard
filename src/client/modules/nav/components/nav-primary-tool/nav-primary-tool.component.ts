/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
	selector: 'orc-nav-primary-tool',
	standalone: false,
	templateUrl: './nav-primary-tool.component.html',
	styleUrl: './nav-primary-tool.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavPrimaryToolComponent {
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
