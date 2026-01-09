/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, signal} from '@angular/core';

@Component({
	selector: 'orc-mint-subsection-config-nut-supported',
	standalone: false,
	templateUrl: './mint-subsection-config-nut-supported.component.html',
	styleUrl: './mint-subsection-config-nut-supported.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNutSupportedComponent {
	public supported = input<boolean | undefined>(undefined);
	public nut_index = input.required<string>();
	public nut_icon = input.required<string>();
	public mobile_view = input<boolean>(false);

	public help_status = signal<boolean>(false); // tracks if the help is visible
}
