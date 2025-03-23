/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
/* Native Dependencies */
import { OrchardError } from '@client/modules/error/types/error.types';

@Component({
	selector: 'orc-error-resolve',
	standalone: false,
	templateUrl: './error-resolve.component.html',
	styleUrl: './error-resolve.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorResolveComponent {

	@Input() error!: OrchardError;

}
