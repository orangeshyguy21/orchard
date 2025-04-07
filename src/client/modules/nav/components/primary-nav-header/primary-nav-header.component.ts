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
  
	@Input() active_section: string = '';
	@Input() block_count!: number;

	public polling_blocks: boolean = false;

	public get epoch(): number { return this.getEpoch(); }

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

	public getEpoch(): number {
		if( this.block_count < 1050000 ) return 5;
		if( this.block_count < 1260000 ) return 6;
		if( this.block_count < 1470000 ) return 7;
		if( this.block_count < 1680000 ) return 8;
		if( this.block_count < 1890000 ) return 9;
		if( this.block_count < 2100000 ) return 10;
		if( this.block_count < 2310000 ) return 11;
		return 12;
	}
}
