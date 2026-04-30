/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';
/* Shared Dependencies */
import {OrchardNut21} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-config-nut21',
	standalone: false,
	templateUrl: './mint-subsection-config-nut21.component.html',
	styleUrl: './mint-subsection-config-nut21.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNut21Component {
    public nut21 = input.required<OrchardNut21 | undefined | null>();
	public device_desktop = input<boolean>(false);

	public help_status_openid = signal<boolean>(false); 
    public help_status_client_id = signal<boolean>(false); 
}
