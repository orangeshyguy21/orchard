/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
/* Shared Dependencies */
import {OrchardNut29} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-nut29',
	standalone: false,
	templateUrl: './mint-subsection-config-nut29.component.html',
	styleUrl: './mint-subsection-config-nut29.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNut29Component {
	public nut29 = input.required<OrchardNut29 | undefined | null>();
	public device_desktop = input<boolean>(false);

	public help_status = signal<boolean>(false);
}
