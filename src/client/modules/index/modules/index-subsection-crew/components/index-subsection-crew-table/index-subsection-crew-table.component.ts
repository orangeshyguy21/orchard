/* Core Dependencies */
import {ChangeDetectionStrategy, Component, effect, input, signal, ViewChild} from '@angular/core';
/* Vendor Dependencies */
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {Invite} from '@client/modules/crew/classes/invite.class';
import {User} from '@client/modules/crew/classes/user.class';

@Component({
	selector: 'orc-index-subsection-crew-table',
	standalone: false,
	templateUrl: './index-subsection-crew-table.component.html',
	styleUrl: './index-subsection-crew-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewTableComponent {
	@ViewChild(MatSort) sort!: MatSort;

	public data = input.required<MatTableDataSource<Invite | User>>();
	public loading = input.required<boolean>();

	public more_entity = signal<Invite | User | null>(null);
	public now = DateTime.now().toSeconds();

	public displayed_columns = ['user', 'label', 'created', 'state', 'actions'];

	constructor() {
		effect(() => {
			if (this.loading() === false) {
				console.log('sorting', this.data().data);
				this.data().sort = this.sort;
			}
		});
	}

	public toggleMore(entity: Invite | User) {
		this.more_entity.set(this.more_entity() === entity ? null : entity);
	}
}

// psychiatry
// local_florist
// nature
