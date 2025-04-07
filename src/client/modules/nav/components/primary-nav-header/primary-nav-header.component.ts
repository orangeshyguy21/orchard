/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'orc-primary-nav-header',
	standalone: false,
	templateUrl: './primary-nav-header.component.html',
	styleUrl: './primary-nav-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavHeaderComponent {
  
	@Input() active_section: string = '';
	@Input() block_count!: number;

	public get epoch(): number {
		if( this.block_count < 1050000 ) return 5;
		if( this.block_count < 1260000 ) return 6;
		if( this.block_count < 1470000 ) return 7;
		if( this.block_count < 1680000 ) return 8;
		if( this.block_count < 1890000 ) return 9;
		if( this.block_count < 2100000 ) return 10;
		if( this.block_count < 2310000 ) return 11;
		return 12;
	}

	constructor(private router: Router) {}

	onClick() {
		this.router.navigate(['/']);
	}
}
