/* Core Dependencies */
import {ChangeDetectionStrategy, Component, effect, input, signal, output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
/* Vendor Dependencies */
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DateTime} from 'luxon';
/* Application Dependencies */
import {Invite} from '@client/modules/crew/classes/invite.class';
import {User} from '@client/modules/crew/classes/user.class';
/* Native Dependencies */
import {CrewEntity} from '@client/modules/index/modules/index-subsection-crew/enums/crew-entity.enum';

enum MoreEntityType {
	TOKEN = 'TOKEN',
	EDIT_USER = 'EDIT_USER',
	EDIT_INVITE = 'EDIT_INVITE',
}

type UserTableEntity = User & {entity_type: CrewEntity.USER};
type InviteTableEntity = Invite & {entity_type: CrewEntity.INVITE};
type CrewTableEntity = UserTableEntity | InviteTableEntity;

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
	public form_invite = input.required<FormGroup>();
	public create_open = input.required<boolean>();
	public table_form_id = input.required<string | null>();

	public editInvite = output<Invite>();
	public editUser = output<User>();

	public more_entity = signal<Invite | User | null>(null);
	public more_entity_type = signal<MoreEntityType | null>(null);
	public now = DateTime.now().toSeconds();
	public readonly CrewEntity = CrewEntity;
	public readonly MoreEntityType = MoreEntityType;
	public readonly displayed_columns = ['user', 'label', 'created', 'state', 'actions'];

	private previous_data_length = 0;

	constructor() {
		effect(() => {
			if (this.loading() === false) {
				this.data().sort = this.sort;
			}

			if (this.create_open()) {
				this.more_entity.set(null);
			}

			if (this.table_form_id() === null) {
				this.more_entity.set(null);
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
	 * @returns {CrewTableEntity} entity with explicit type
	 */
	public asCrewEntity(entity: Invite | User): CrewTableEntity {
		return 'name' in entity && entity.name !== undefined
			? ({...entity, entity_type: CrewEntity.USER} as UserTableEntity)
			: ({...entity, entity_type: CrewEntity.INVITE} as InviteTableEntity);
	}

	/**
	 * Reacts when a single new entity (invite or user) is added
	 * @param {Invite | User} entity - the newly added entity
	 */
	private onNewEntityAdded(entity: Invite | User): void {
		const crew_entity = this.asCrewEntity(entity);
		if (crew_entity.entity_type === CrewEntity.INVITE) {
			this.onViewToken(null, entity as Invite);
		}
	}

	public onToggleMore(entity: Invite | User) {
		const entity_type = this.asCrewEntity(entity).entity_type;
		const more_entity_type = entity_type === CrewEntity.INVITE ? MoreEntityType.TOKEN : MoreEntityType.EDIT_USER;
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
		let more_entity_type;
		if (entity_type === CrewEntity.INVITE) {
			this.editInvite.emit(entity as Invite);
			more_entity_type = MoreEntityType.EDIT_INVITE;
		} else {
			this.editUser.emit(entity as User);
			more_entity_type = MoreEntityType.EDIT_USER;
		}
		this.more_entity_type.set(more_entity_type);
		this.more_entity.set(entity);
	}

	public onDelete(event: MouseEvent, entity: Invite | User) {
		event.stopPropagation();
		event.preventDefault();
		console.log('delete', entity);
		// dialog
	}

	public onCloseInvite(entity: Invite): void {
		this.onToggleMore(entity);
		this.form_invite().reset();
		this.form_invite().markAsPristine();
		this.form_invite().markAsUntouched();
		this.form_invite().updateValueAndValidity();
	}

	public onCancelInviteControl(control_name: keyof Invite): void {
		this.form_invite()
			.get(control_name)
			?.setValue((this.more_entity() as Invite)?.[control_name]);
		this.form_invite().get(control_name)?.markAsPristine();
		this.form_invite().get(control_name)?.markAsUntouched();
		this.form_invite().get(control_name)?.updateValueAndValidity();
	}
}
