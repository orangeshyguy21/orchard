/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
/* Native Dependencies */
import {User} from '@client/modules/crew/classes/user.class';

@Component({
	selector: 'orc-index-subsection-crew-table-user',
	standalone: false,
	templateUrl: './index-subsection-crew-table-user.component.html',
	styleUrl: './index-subsection-crew-table-user.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewTableUserComponent {
	public user = input.required<User>();
	public is_self = input.required<boolean>();
	public is_admin = input.required<boolean>();
	public device_desktop = input.required<boolean>();

	public editUser = output<User>();
	public deleteUser = output<User>();
}
