/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Application Dependencies */
import {NonNullableIndexCrewSettings} from '@client/modules/settings/types/setting.types';

@Component({
	selector: 'orc-index-subsection-crew-control',
	standalone: false,
	templateUrl: './index-subsection-crew-control.component.html',
	styleUrl: './index-subsection-crew-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewControlComponent {
	public form_group = input.required<FormGroup>();
}
