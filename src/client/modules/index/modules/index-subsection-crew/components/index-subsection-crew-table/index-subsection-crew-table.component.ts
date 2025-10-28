/* Core Dependencies */
import {ChangeDetectionStrategy, Component, effect, input, signal, ViewChild} from '@angular/core';
/* Vendor Dependencies */
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {Invite} from '@client/modules/crew/classes/invite.class';
import {User} from '@client/modules/crew/classes/user.class';

enum CrewEntityType {
	USER = 'USER',
	INVITE = 'INVITE',
}
enum MoreEntityType {
	TOKEN = 'TOKEN',
	EDIT_USER = 'EDIT_USER',
	EDIT_INVITE = 'EDIT_INVITE',
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
	public more_entity_type = signal<MoreEntityType | null>(null);
	public now = DateTime.now().toSeconds();
	public readonly CrewEntityType = CrewEntityType;
	public readonly MoreEntityType = MoreEntityType;
	public readonly displayed_columns = ['user', 'label', 'created', 'state', 'actions'];

	private previous_data_length = 0;

	constructor() {
		effect(() => {
			if (this.loading() === false) {
				this.data().sort = this.sort;
			}

			const current_data = this.data().data;
			const current_length = current_data.length;
			if (current_length === this.previous_data_length + 1) {
				const new_entity = current_data[0];
				this.onNewEntityAdded(new_entity);
			}
			this.previous_data_length = current_length;
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

	/**
	 * Reacts when a single new entity (invite or user) is added
	 * @param {Invite | User} entity - the newly added entity
	 */
	private onNewEntityAdded(entity: Invite | User): void {
		const crew_entity = this.asCrewEntity(entity);
		if (crew_entity.entity_type === CrewEntityType.INVITE) {
			this.onViewToken(null, entity as Invite);
		}
	}

	public onToggleMore(entity: Invite | User) {
		const entity_type = this.asCrewEntity(entity).entity_type;
		const more_entity_type = entity_type === CrewEntityType.INVITE ? MoreEntityType.TOKEN : MoreEntityType.EDIT_USER;
		this.more_entity_type.set(more_entity_type);
		this.more_entity.set(this.more_entity() === entity ? null : entity);
	}

	public onViewToken(event: MouseEvent | null, entity: Invite) {
		if (event) {
			event.stopPropagation();
			event.preventDefault();
		}
		this.more_entity_type.set(MoreEntityType.TOKEN);
		this.more_entity.set(entity);
	}

	public onEdit(event: MouseEvent, entity: Invite | User) {
		event.stopPropagation();
		event.preventDefault();
		const entity_type = this.asCrewEntity(entity).entity_type;
		const more_entity_type = entity_type === CrewEntityType.INVITE ? MoreEntityType.EDIT_INVITE : MoreEntityType.EDIT_USER;
		this.more_entity_type.set(more_entity_type);
		this.more_entity.set(entity);
		// this.more_entity_type.set(MoreEntityType.EDIT_INVITE);
		// this.more_entity.set(entity);
	}

	public onDelete(event: MouseEvent, entity: Invite | User) {
		event.stopPropagation();
		event.preventDefault();
		console.log('delete', entity);
		// dialog
	}
}
