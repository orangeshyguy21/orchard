import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
	selector: 'orc-primary-nav-item',
	standalone: false,
	templateUrl: './primary-nav-item.component.html',
	styleUrl: './primary-nav-item.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavItemComponent {

	@Input() icon!: string;
	@Input() name!: string;
	@Input() mode: 'default' | 'svg' = 'default';

	public active = false;
	public moused = false;

	public get highlight(){ return this.active || this.moused; }
	public get icon_outline(){ return `${this.icon}_outline`; }
	public get active_svg_icon(){ return this.highlight ? this.icon : this.icon_outline; }

	constructor(private changeDetectorRef: ChangeDetectorRef) {}

	public onMouseOver(){
		this.moused = true;
		this.changeDetectorRef.detectChanges();
	}

	public onMouseOut(){
		if(this.active) return;
		this.moused = false;
		this.changeDetectorRef.detectChanges();
	}
}
