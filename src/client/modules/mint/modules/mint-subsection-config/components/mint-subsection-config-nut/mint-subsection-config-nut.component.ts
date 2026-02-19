/* Core Dependencies */
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
/* Vendor Dependencies */
import {MatDialog} from '@angular/material/dialog';
/* Application Dependencies */
import {PublicExitWarningComponent} from '@client/modules/public/components/public-exit-warning/public-exit-warning.component';

@Component({
	selector: 'orc-mint-subsection-config-nut',
	standalone: false,
	templateUrl: './mint-subsection-config-nut.component.html',
	styleUrl: './mint-subsection-config-nut.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionConfigNutComponent {
    private dialog = inject(MatDialog);
    
	public nut_index = input.required<string>();
	public supported = input.required<boolean>();

	/** Opens the exit warning dialog before navigating to the NUT spec */
	onNutClick() {
		const link = `https://github.com/cashubtc/nuts/blob/main/${this.nut_index()}.md`;
		this.dialog.open(PublicExitWarningComponent, {data: {link}});
	}
}
