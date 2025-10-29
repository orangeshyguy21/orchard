/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, signal, HostListener, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {Subscription, lastValueFrom, forkJoin} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {ConfigService} from '@client/modules/config/services/config.service';
import {CrewService} from '@client/modules/crew/services/crew/crew.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {NonNullableIndexCrewSettings} from '@client/modules/settings/types/setting.types';
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

	public form_open = signal<boolean>(false);
	public loading = signal<boolean>(true);
	public data = signal<MatTableDataSource<Invite | User>>(new MatTableDataSource<Invite | User>([]));
	public page_settings!: NonNullableIndexCrewSettings;
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
	public form_invite: FormGroup = new FormGroup({
		label: new FormControl<string>('', [Validators.maxLength(255)]),
		role: new FormControl<UserRole>(UserRole.Reader, [Validators.required]),
		expiration_enabled: new FormControl<boolean>(true, [Validators.required]),
		expiration_date: new FormControl<DateTime | null>({value: null, disabled: false}, [Validators.required]),
		expiration_time: new FormControl<number | null>({value: null, disabled: false}, [Validators.required]),
	});

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();
	private new_invite: Invite | null = null;

	constructor(
		private settingService: SettingService,
		private eventService: EventService,
		private configService: ConfigService,
		private crewService: CrewService,
	) {}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		// this.page_settings = this.getPageSettings();\
		this.loadCrewData();
		this.subscriptions.add(this.getEventSubscription());
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

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if (event_data === null) {
				setTimeout(() => {
					if (!this.form_open()) return;
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
		!this.form_open() ? this.onOpenInvite() : this.onCloseInvite();
	}

	public onOpenInvite(): void {
		const now = DateTime.now();
		const eight_hours_from_now = now.plus({hours: 8});
		const expiration_time = eight_hours_from_now.hour;
		this.form_invite.reset();
		this.form_invite.get('role')?.setValue(UserRole.Reader);
		this.form_invite.get('expiration_enabled')?.setValue(true);
		this.form_invite.get('expiration_date')?.setValue(eight_hours_from_now);
		this.form_invite.get('expiration_time')?.setValue(expiration_time);
		this.form_open.set(!this.form_open());
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
		this.form_open.set(false);
		this.eventService.registerEvent(null);
	}

	public onCancel(control_name: string): void {
		this.form_invite.get(control_name)?.reset();
	}

	private onConfirmedEvent(): void {
		if (this.form_invite.invalid) {
			return this.eventService.registerEvent(
				new EventData({
					type: 'WARNING',
					message: 'Invalid invite',
				}),
			);
		}
		const {label, role, expiration_enabled, expiration_date, expiration_time} = this.form_invite.value;
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
		this.form_open.set(false);
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
		console.log('edit invite', invite);
	}

	public onEditUser(user: User): void {
		console.log('edit user', user);
	}
}
