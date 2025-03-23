/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrchardError } from '@client/modules/error/types/error.types';

@Component({
	selector: 'orc-mint-subsection-error',
	standalone: false,
	templateUrl: './mint-subsection-error.component.html',
	styleUrl: './mint-subsection-error.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionErrorComponent {

	errors!: OrchardError[];

	constructor(
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef,
	) { }

	ngOnInit(): void {
		this.errors = (history.state) ? history.state['errors'] : [];
		this.changeDetectorRef.detectChanges();
		// here we look for 
		// RPC errors (api rn...)
			// show a truncated nav
			// tell the user the mint is unreachable
		
		// mint database errors (connection issues)
			// tell the user the mint database is unreachable
	}
}