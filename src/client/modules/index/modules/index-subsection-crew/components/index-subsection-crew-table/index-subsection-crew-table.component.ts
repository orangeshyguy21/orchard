/* Core Dependencies */
import {ChangeDetectionStrategy, Component, effect, input, signal, ViewChild} from '@angular/core';
/* Vendor Dependencies */
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {Invite} from '@client/modules/crew/classes/invite.class';
import {User} from '@client/modules/crew/classes/user.class';

// Local enum for this table only
enum CrewEntityType {
	USER = 'USER',
	INVITE = 'INVITE',
}

// Local discriminated union types
type UserEntity = User & {entity_type: CrewEntityType.USER};
type InviteEntity = Invite & {entity_type: CrewEntityType.INVITE};
type CrewEntity = UserEntity | InviteEntity;

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
	public readonly CrewEntityType = CrewEntityType;

	public displayed_columns = ['user', 'label', 'created', 'state', 'actions'];

	constructor() {
		effect(() => {
			if (this.loading() === false) {
				console.log('sorting', this.data().data);
				this.data().sort = this.sort;
			}
		});
	}

	/**
	 * Helper method to add type discriminator to entities
	 * @param {Invite | User} entity - the crew entity
	 * @returns {CrewEntity} entity with explicit type
	 */
	public asCrewEntity(entity: Invite | User): CrewEntity {
		return 'name' in entity && entity.name !== undefined
			? ({...entity, entity_type: CrewEntityType.USER} as UserEntity)
			: ({...entity, entity_type: CrewEntityType.INVITE} as InviteEntity);
	}

	public toggleMore(entity: Invite | User) {
		this.more_entity.set(this.more_entity() === entity ? null : entity);
	}
}

// psychiatry
// local_florist
// nature
