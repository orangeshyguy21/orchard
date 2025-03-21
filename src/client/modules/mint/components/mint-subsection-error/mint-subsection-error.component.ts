/* Core Dependencies */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'orc-mint-subsection-error',
	standalone: false,
	templateUrl: './mint-subsection-error.component.html',
	styleUrl: './mint-subsection-error.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionErrorComponent {

	error_data: any;

	constructor(private router: Router) { }

	ngOnInit(): void {
		this.error_data = (history.state) ? history.state['errors'] : [];
		console.log('ERROR DATA:', this.error_data);
		// here we look for 
		// RPC errors (api rn...)
			// show a truncated nav
			// tell the user the mint is unreachable
		
		// mint database errors (connection issues)
			// tell the user the mint database is unreachable


	}
}