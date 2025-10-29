/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, signal, effect, HostListener, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {Subscription, lastValueFrom, forkJoin} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {EventService} from '@client/modules/event/services/event/event.service';
import {ConfigService} from '@client/modules/config/services/config.service';
import {CrewService} from '@client/modules/crew/services/crew/crew.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {User} from '@client/modules/crew/classes/user.class';
import {Invite} from '@client/modules/crew/classes/invite.class';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
/* Native Dependencies */
import {CrewEntity} from '@client/modules/index/modules/index-subsection-crew/enums/crew-entity.enum';
import {EntityOption, RoleOption} from '@client/modules/index/modules/index-subsection-crew/types/crew-panel.types';
/* Shared Dependencies */
import {UserRole} from '@shared/generated.types';

@Component({
	selector: 'orc-index-subsection-crew',
	standalone: false,
	templateUrl: './index-subsection-crew.component.html',
	styleUrl: './index-subsection-crew.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionCrewComponent implements OnInit {
	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	@ViewChild('invite_form', {static: false}) invite_form!: ElementRef;

	public id_user = signal<string | null>(null);
	public form_dirty = signal<boolean>(false);
	public form_invite_create_open = signal<boolean>(false);
	public table_form_id = signal<string | null>(null);
	public loading = signal<boolean>(true);
	public data = signal<MatTableDataSource<Invite | User>>(new MatTableDataSource<Invite | User>([]));
	public readonly panel = new FormGroup({
		filter: new FormControl<string>(''),
		entity: new FormControl<CrewEntity[]>([CrewEntity.USER, CrewEntity.INVITE]),
		role: new FormControl<UserRole[]>([UserRole.Admin, UserRole.Manager, UserRole.Reader]),
	});
	public entity_options: EntityOption[] = [
		{label: 'Users', value: CrewEntity.USER},
		{label: 'Invites', value: CrewEntity.INVITE},
	];
	public role_options: RoleOption[] = [
		{label: 'Admin', value: UserRole.Admin},
		{label: 'Manager', value: UserRole.Manager},
		{label: 'Reader', value: UserRole.Reader},
	];
	public form_invite_create: FormGroup = new FormGroup({
		label: new FormControl<string>('', [Validators.maxLength(255)]),
		role: new FormControl<UserRole>(UserRole.Reader, [Validators.required]),
		expiration_enabled: new FormControl<boolean>(true, [Validators.required]),
		expiration_date: new FormControl<DateTime | null>({value: null, disabled: false}, [Validators.required]),
		expiration_time: new FormControl<number | null>({value: null, disabled: false}, [Validators.required]),
	});
	public form_invite_edit: FormGroup = new FormGroup({
		label: new FormControl<string>('', [Validators.maxLength(255)]),
		role: new FormControl<UserRole>(UserRole.Reader, [Validators.required]),
		expiration_enabled: new FormControl<boolean>(true, [Validators.required]),
		expiration_date: new FormControl<DateTime | null>({value: null, disabled: false}, [Validators.required]),
		expiration_time: new FormControl<number | null>({value: null, disabled: false}, [Validators.required]),
	});
	public form_user_edit: FormGroup = new FormGroup({
		label: new FormControl<string>('', [Validators.maxLength(255)]),
		role: new FormControl<UserRole>(UserRole.Reader, [Validators.required]),
	});

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();
	private new_invite: Invite | null = null;

	constructor(
		private eventService: EventService,
		private configService: ConfigService,
		private crewService: CrewService,
	) {
		effect(() => {
			const dirty = this.form_dirty();
			this.createPendingEvent(dirty);
		});
	}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		this.loadCrewData();
		this.subscriptions.add(this.getUserSubscription());
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getFormSubscription());
		this.orchardOptionalInit();
	}

	orchardOptionalInit(): void {
		if (this.configService.config.ai.enabled) {
			// this.subscriptions.add(this.getAgentSubscription());
			// this.subscriptions.add(this.getToolSubscription());
		}
	}

	/* *******************************************************
		Subscriptions                      
	******************************************************** */

	private getUserSubscription(): Subscription {
		return this.crewService.user$.subscribe({
			next: (user: User | null) => {
				if (user === undefined || user === null) return;
				this.id_user.set(user.id);
			},
			error: (error) => {
				console.error(error);
				this.id_user.set(null);
			},
		});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if (event_data === null) {
				setTimeout(() => {
					if (!this.form_invite_create_open()) return;
					this.eventService.registerEvent(
						new EventData({
							type: 'PENDING',
							message: 'Save',
						}),
					);
				}, 1000);
			}
			if (event_data) {
				if (event_data.type === 'SUCCESS') this.onSuccessEvent();
				if (event_data.confirmed !== null) event_data.confirmed ? this.onConfirmedEvent() : this.onCloseInvite();
			}
		});
	}

	private getFormSubscription(): Subscription {
		return this.form_invite_edit.valueChanges.subscribe(() => {
			this.evaluateDirtyCount();
		});
	}

	/* *******************************************************
	   Data                      
	******************************************************** */

	private async loadCrewData(): Promise<void> {
		const users_obs = this.crewService.loadUsers();
		const invites_obs = this.crewService.loadInvites();
		const [users, invites] = await lastValueFrom(forkJoin([users_obs, invites_obs]));
		const combined_data = [...users, ...invites].sort((a, b) => b.created_at - a.created_at);
		this.data.set(new MatTableDataSource(combined_data));
		this.loading.set(false);
	}

	/* *******************************************************
		Form                      
	******************************************************** */

	public onInvite(): void {
		!this.form_invite_create_open() ? this.onOpenInvite() : this.onCloseInvite();
	}

	public onOpenInvite(): void {
		const now = DateTime.now();
		const eight_hours_from_now = now.plus({hours: 8});
		const expiration_time = eight_hours_from_now.hour;
		this.form_invite_create.reset();
		this.form_invite_create.get('role')?.setValue(UserRole.Reader);
		this.form_invite_create.get('expiration_enabled')?.setValue(true);
		this.form_invite_create.get('expiration_date')?.setValue(eight_hours_from_now);
		this.form_invite_create.get('expiration_time')?.setValue(expiration_time);
		this.form_invite_create_open.set(!this.form_invite_create_open());
		this.eventService.registerEvent(
			new EventData({
				type: 'PENDING',
				message: 'Save',
			}),
		);
		this.invite_form.nativeElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest',
		});
	}

	public onCloseInvite(): void {
		this.form_invite_create_open.set(false);
		this.eventService.registerEvent(null);
	}

	public onCancel(control_name: 'label' | 'role' | 'expiration'): void {
		if (control_name === 'role') {
			this.form_invite_create.get('role')?.setValue(UserRole.Reader);
			this.form_invite_create.get(control_name)?.markAsPristine();
			this.form_invite_create.get(control_name)?.markAsUntouched();
			this.form_invite_create.get(control_name)?.updateValueAndValidity();
		}
		if (control_name === 'label') {
			this.form_invite_create.get('label')?.setValue('');
			this.form_invite_create.get(control_name)?.markAsPristine();
			this.form_invite_create.get(control_name)?.markAsUntouched();
			this.form_invite_create.get(control_name)?.updateValueAndValidity();
		}
		if (control_name === 'expiration') {
			const now = DateTime.now();
			const eight_hours_from_now = now.plus({hours: 8});
			const expiration_time = eight_hours_from_now.hour;
			this.form_invite_create.get('expiration_time')?.setValue(expiration_time);
			this.form_invite_create.get('expiration_date')?.setValue(eight_hours_from_now);
			this.form_invite_create.get('expiration_time')?.markAsPristine();
			this.form_invite_create.get('expiration_time')?.markAsUntouched();
			this.form_invite_create.get('expiration_time')?.updateValueAndValidity();
			this.form_invite_create.get('expiration_date')?.markAsPristine();
			this.form_invite_create.get('expiration_date')?.markAsUntouched();
			this.form_invite_create.get('expiration_date')?.updateValueAndValidity();
		}
	}

	private onConfirmedEvent(): void {
		if (this.form_invite_create_open()) this.createInvite();
		else {
			if (this.form_invite_edit.dirty) this.updateInvite();
		}
	}

	private createInvite(): void {
		if (this.form_invite_create.invalid) {
			return this.eventService.registerEvent(
				new EventData({
					type: 'WARNING',
					message: 'Invalid invite',
				}),
			);
		}
		const {label, role, expiration_enabled, expiration_date, expiration_time} = this.form_invite_create.value;
		const expiration_timestamp = this.getExpirationTimestamp(expiration_enabled, expiration_date, expiration_time);
		const now = Math.floor(DateTime.now().toSeconds());
		if (expiration_timestamp && expiration_timestamp < now) {
			return this.eventService.registerEvent(
				new EventData({
					type: 'WARNING',
					message: 'Expiration date is in the past',
				}),
			);
		}
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.form_invite_create_open.set(false);
		this.crewService.createInvite(role, label, expiration_timestamp).subscribe({
			next: (invite) => {
				this.new_invite = invite;
				this.eventService.registerEvent(
					new EventData({
						type: 'SUCCESS',
						message: 'Invite created!',
					}),
				);
			},
			error: (error: OrchardErrors) => {
				this.new_invite = null;
				this.eventService.registerEvent(
					new EventData({
						type: 'ERROR',
						message: error.errors[0].message,
					}),
				);
			},
		});
	}

	private updateInvite(): void {
		if (this.form_invite_edit.invalid) {
			return this.eventService.registerEvent(
				new EventData({
					type: 'WARNING',
					message: 'Invalid invite',
				}),
			);
		}
		const {label, role, expiration_enabled, expiration_date, expiration_time} = this.form_invite_edit.value;
		const expiration_timestamp = this.getExpirationTimestamp(expiration_enabled, expiration_date, expiration_time);
		const now = Math.floor(DateTime.now().toSeconds());
		if (expiration_timestamp && expiration_timestamp < now) {
			return this.eventService.registerEvent(
				new EventData({
					type: 'WARNING',
					message: 'Expiration date is in the past',
				}),
			);
		}
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.form_invite_edit.markAsPristine();
		this.form_dirty.set(false);
		if (!this.table_form_id()) return;
		this.crewService.updateInvite(this.table_form_id()!, label, role, expiration_timestamp).subscribe({
			next: (updated_invite) => {
				// Update the invite in the data table
				const current_data = this.data().data;
				const updated_data = current_data.map((item) => {
					if (item instanceof Invite && item.id === updated_invite.id) {
						return updated_invite;
					}
					return item;
				});
				this.data.set(new MatTableDataSource(updated_data));
				this.table_form_id.set(null);
				this.eventService.registerEvent(
					new EventData({
						type: 'SUCCESS',
						message: 'Invite updated!',
					}),
				);
			},
			error: (error: OrchardErrors) => {
				this.eventService.registerEvent(
					new EventData({
						type: 'ERROR',
						message: error.errors[0].message,
					}),
				);
			},
		});
	}

	private getExpirationTimestamp(
		expiration_enabled: boolean,
		expiration_date: DateTime | null,
		expiration_time: number | null,
	): number | null {
		if (!expiration_enabled) return null;
		if (!expiration_date || !expiration_time) return null;
		return expiration_date
			.set({
				hour: expiration_time,
				minute: 0,
				second: 0,
				millisecond: 0,
			})
			.toSeconds();
	}

	private onSuccessEvent(): void {
		if (!this.new_invite) return;
		const current_data = this.data().data;
		const updated_data = [this.new_invite, ...current_data].sort((a, b) => b.created_at - a.created_at);
		this.data.set(new MatTableDataSource(updated_data));
	}

	public onEditInvite(invite: Invite): void {
		this.onCloseInvite();
		this.table_form_id.set(invite.id);
		this.form_invite_edit.get('role')?.setValue(invite.role);
		this.form_invite_edit.get('label')?.setValue(invite.label);
		if (invite.expires_at !== null) {
			const expiration_datetime = DateTime.fromSeconds(invite.expires_at);
			const expiration_hour = expiration_datetime.hour;
			this.form_invite_edit.get('expiration_enabled')?.setValue(true);
			this.form_invite_edit.get('expiration_date')?.setValue(expiration_datetime);
			this.form_invite_edit.get('expiration_time')?.setValue(expiration_hour);
		} else {
			const now = DateTime.now();
			const eight_hours_from_now = now.plus({hours: 8});
			const expiration_time = eight_hours_from_now.hour;
			this.form_invite_edit.get('expiration_enabled')?.setValue(false);
			this.form_invite_edit.get('expiration_date')?.setValue(eight_hours_from_now);
			this.form_invite_edit.get('expiration_time')?.setValue(expiration_time);
			this.form_invite_edit.get('expiration_date')?.disable();
			this.form_invite_edit.get('expiration_time')?.disable();
		}
	}

	public onEditUser(user: User): void {
		this.onCloseInvite();
		this.table_form_id.set(user.id);
		this.form_user_edit.get('label')?.setValue(user.label);
		this.form_user_edit.get('role')?.setValue(user.role);
	}

	public onDeleteInvite(invite: Invite): void {
		console.log('delete invite', invite);
	}

	public onDeleteUser(user: User): void {
		console.log('delete user', user);
	}

	private createPendingEvent(dirty: boolean): void {
		if (!dirty && this.active_event?.type !== 'PENDING') return;
		if (!dirty) return this.eventService.registerEvent(null);
		const message = 'update';
		this.eventService.registerEvent(
			new EventData({
				type: 'PENDING',
				message: message,
			}),
		);
	}

	private evaluateDirtyCount(): void {
		const contrtol_count = Object.keys(this.form_invite_edit.controls)
			.filter((key) => this.form_invite_edit.get(key) instanceof FormControl)
			.filter((key) => this.form_invite_edit.get(key)?.dirty).length;
		this.form_dirty.set(contrtol_count > 0);
	}
}
