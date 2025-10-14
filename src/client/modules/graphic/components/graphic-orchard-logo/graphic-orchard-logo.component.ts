/* Core Dependencies */
import {ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef} from '@angular/core';
/* Application Dependencies */
import {ThemeType} from '@client/modules/cache/services/local-storage/local-storage.types';

@Component({
	selector: 'orc-graphic-orchard-logo',
	standalone: false,
	templateUrl: './graphic-orchard-logo.component.html',
	styleUrl: './graphic-orchard-logo.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicOrchardLogoComponent implements OnInit {
	@Input() height: string = '40px';
	@Input() surface: boolean = false;
	@Input() animate: boolean = false;
	@Input() theme: ThemeType = ThemeType.DARK_MODE;

	public darkest: boolean = false;
	public dark: boolean = false;
	public medium: boolean = false;
	public light: boolean = false;
	public lightest: boolean = false;

	constructor(private readonly cdr: ChangeDetectorRef) {}

	public ngOnInit(): void {
		this.darkest = !this.animate;
		this.dark = !this.animate;
		this.medium = !this.animate;
		this.light = !this.animate;
		this.lightest = !this.animate;
		if (this.animate) this.startAnimation();
	}

	private startAnimation(): void {
		const delay = 100;
		this.darkest = true;
		this.cdr.detectChanges();
		setTimeout(() => {
			this.dark = true;
			this.cdr.detectChanges();
			setTimeout(() => {
				this.medium = true;
				this.cdr.detectChanges();
				setTimeout(() => {
					this.light = true;
					this.cdr.detectChanges();
					setTimeout(() => {
						this.lightest = true;
						this.cdr.detectChanges();
					}, delay);
				}, delay);
			}, delay);
		}, delay);
	}
}
