/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrchardErr } from '@client/modules/api/types/api.types';

@Component({
	selector: 'orc-mint-subsection-error',
	standalone: false,
	templateUrl: './mint-subsection-error.component.html',
	styleUrl: './mint-subsection-error.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionErrorComponent {

	// errors!: OrchardErr[];

	public has_public_api_error: boolean = false;
	public has_database_error: boolean = false;
	// public has_rpc_error: boolean = false;


	constructor(
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef,
	) { }

	ngOnInit(): void {
		const errors = (history.state) ? history.state['errors'] : [];

		errors.forEach((error: OrchardErr) => {
			if (error.code === 40001) this.has_public_api_error = true;
			if (error.code === 40002) this.has_database_error = true;
		});

		this.changeDetectorRef.detectChanges();

		// here we look for 
		// RPC errors (api rn...)
			// show a truncated nav
			// tell the user the mint is unreachable
		
		// mint database errors (connection issues)
			// tell the user the mint database is unreachable


	}
}