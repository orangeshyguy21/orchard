/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'orc-primary-nav-header',
	standalone: false,
	templateUrl: './primary-nav-header.component.html',
	styleUrl: './primary-nav-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('blockCountChange', [
			transition('* => *', [
				animate('200ms ease-out', style({ opacity: 0.1 })),
				animate('400ms ease-in', style({ opacity: 1 }))
			]),
		])
	]
})
export class PrimaryNavHeaderComponent implements OnChanges {
  
	@Input() active!: boolean;
	@Input() block_count!: number;
	@Input() chain!: string;

	public polling_blocks: boolean = false;

	constructor(
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if( !changes['block_count'] ) return;
		if( changes['block_count'].firstChange ) return;
		setTimeout(() => {
			this.polling_blocks = true;
			this.changeDetectorRef.detectChanges();
		}, 1000);
	}

	public onClick() {
		this.router.navigate(['/']);
	}
}
