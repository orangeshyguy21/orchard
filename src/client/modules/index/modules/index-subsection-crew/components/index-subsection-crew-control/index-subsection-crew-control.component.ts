/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Native Dependencies */
import {EntityOption, RoleOption} from '@client/modules/index/modules/index-subsection-crew/types/crew-panel.types';

@Component({
	selector: 'orc-index-subsection-crew-control',
	standalone: false,
	templateUrl: './index-subsection-crew-control.component.html',
	styleUrl: './index-subsection-crew-control.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewControlComponent {
	public form_group = input.required<FormGroup>();
	public entity_options = input.required<EntityOption[]>();
	public role_options = input.required<RoleOption[]>();
}
