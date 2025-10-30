/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output, signal} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Native Dependencies */
import {RoleOption} from '@client/modules/index/modules/index-subsection-crew/types/crew-panel.types';

@Component({
	selector: 'orc-index-subsection-crew-form-user',
	standalone: false,
	templateUrl: './index-subsection-crew-form-user.component.html',
	styleUrl: './index-subsection-crew-form-user.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewFormUserComponent {
	public form_group = input.required<FormGroup>();
	public id_entity = input.required<string | null>();
	public role_options = input.required<RoleOption[]>();

	public close = output<void>();
	public cancel = output<'label' | 'role'>();

	public focused_role = signal<boolean>(false);
	public focused_label = signal<boolean>(false);
}
