/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
/* Shared Dependencies */
import {OrchardNut19} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-nut19',
	standalone: false,
	templateUrl: './mint-subsection-config-nut19.component.html',
	styleUrl: './mint-subsection-config-nut19.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNut19Component {
	public nut19 = input.required<OrchardNut19 | undefined | null>();
	public device_desktop = input<boolean>(false);

	public help_status = signal<boolean>(false); // tracks if the help is visible
}
