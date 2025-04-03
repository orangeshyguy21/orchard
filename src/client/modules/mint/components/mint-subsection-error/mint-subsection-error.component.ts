/* Core Dependencies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
/* Application Dependencies */
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
		private changeDetectorRef: ChangeDetectorRef,
	) { }

	ngOnInit(): void {
		this.errors = (history.state) ? history.state?.error?.errors : [];
		this.changeDetectorRef.detectChanges();
	}
}