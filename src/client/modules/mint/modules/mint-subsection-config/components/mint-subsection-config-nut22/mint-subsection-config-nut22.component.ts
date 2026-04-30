/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
/* Shared Dependencies */
import {OrchardNut22} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-nut22',
	standalone: false,
	templateUrl: './mint-subsection-config-nut22.component.html',
	styleUrl: './mint-subsection-config-nut22.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNut22Component {
	public nut22 = input.required<OrchardNut22 | undefined | null>();
	public device_desktop = input<boolean>(false);

	public help_status = signal<boolean>(false);
}
