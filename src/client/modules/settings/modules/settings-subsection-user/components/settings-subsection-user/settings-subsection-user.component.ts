/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, OnDestroy, WritableSignal, signal, effect} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {UserService} from '@client/modules/user/services/user/user.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {User} from '@client/modules/user/classes/user.class';
import {OrchardErrors} from '@client/modules/error/classes/error.class';

@Component({
	selector: 'orc-settings-subsection-user',
	standalone: false,
	templateUrl: './settings-subsection-user.component.html',
	styleUrl: './settings-subsection-user.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionUserComponent implements OnInit, OnDestroy {
	public form_user_name: FormGroup = new FormGroup({
		name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
	});

	public user = signal<User | null>(null);

	private dirty_count: WritableSignal<number> = signal(0);

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private userService: UserService,
		private eventService: EventService,
	) {
		effect(() => {
			this.createPendingEvent(this.dirty_count());
		});
	}

	ngOnInit(): void {
		this.subscriptions.add(this.getUserSubscription());
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getFormSubscription());
	}

	private getUserSubscription(): Subscription {
		return this.userService.user$.subscribe((user) => {
			if (user === undefined || user === null) return;
			this.user.set(new User(user));
			this.setUserNameFrom();
		});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if (event_data === null) this.evaluateDirtyCount();
			if (event_data && event_data.confirmed !== null) {
				event_data.confirmed ? this.onConfirmedEvent() : this.onUnconfirmedEvent();
			}
		});
	}

	private getFormSubscription(): Subscription {
		return this.form_user_name.valueChanges.subscribe(() => {
			this.evaluateDirtyCount();
		});
	}

	private setUserNameFrom(): void {
		this.form_user_name.setValue({name: this.user()?.name}, {emitEvent: false});
	}

	public onCancelUserName(control_name: string): void {
		this.setUserNameFrom();
		this.form_user_name.get(control_name)?.markAsPristine();
		this.form_user_name.get(control_name)?.markAsUntouched();
		this.form_user_name.get(control_name)?.setErrors(null);
		this.evaluateDirtyCount();
	}

	public onSubmitUserName(): void {
		if (this.form_user_name.invalid) {
			return this.eventService.registerEvent(
				new EventData({
					type: 'WARNING',
					message: 'Invalid info',
				}),
			);
		}
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.userService.updateUserName(this.form_user_name.value.name).subscribe({
			next: (user: User) => {
				this.userService.clearUserCache();
				this.userService.loadUser().subscribe();
				this.eventService.registerEvent(
					new EventData({
						type: 'SUCCESS',
						message: 'User name updated!',
					}),
				);
				this.setUserNameFrom();
				this.form_user_name.markAsPristine();
				this.evaluateDirtyCount();
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

	public onSaveUserPassword(): void {
		console.log('onSaveUserPassword');
	}

	private evaluateDirtyCount(): void {
		const contrtol_count = Object.keys(this.form_user_name.controls)
			.filter((key) => this.form_user_name.get(key) instanceof FormControl)
			.filter((key) => this.form_user_name.get(key)?.dirty).length;
		this.dirty_count.set(contrtol_count);
	}

	private createPendingEvent(count: number): void {
		if (count === 0 && this.active_event?.type !== 'PENDING') return;
		if (count === 0) return this.eventService.registerEvent(null);
		const message = count === 1 ? '1 update' : `${count} updates`;
		this.eventService.registerEvent(
			new EventData({
				type: 'PENDING',
				message: message,
			}),
		);
	}

	private onConfirmedEvent(): void {
		this.onSubmitUserName();
	}

	private onUnconfirmedEvent(): void {
		this.onCancelUserName('name');
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
