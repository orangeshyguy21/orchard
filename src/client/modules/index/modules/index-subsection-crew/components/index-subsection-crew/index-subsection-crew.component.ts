/* Core Dependencies */
import {ChangeDetectionStrategy, Component, OnInit, signal, HostListener, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
import {DateTime} from 'luxon';
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {SettingService} from '@client/modules/settings/services/setting/setting.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {ConfigService} from '@client/modules/config/services/config.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {NonNullableIndexCrewSettings} from '@client/modules/settings/types/setting.types';
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

	public page_settings!: NonNullableIndexCrewSettings;
	public readonly panel = new FormGroup({
		filter: new FormControl<string>(''),
	});
	public form_invite: FormGroup = new FormGroup({
		label: new FormControl<string>('', [Validators.maxLength(255)]),
		role: new FormControl<UserRole>(UserRole.Reader, [Validators.required]),
		expiration_enabled: new FormControl<boolean>(true, [Validators.required]),
		expiration_date: new FormControl<DateTime | null>({value: null, disabled: false}, [Validators.required]),
		expiration_time: new FormControl<number | null>({value: null, disabled: false}, [Validators.required]),
	});

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();

	constructor(
		private settingService: SettingService,
		private eventService: EventService,
		private configService: ConfigService,
	) {}

	/* *******************************************************
	   Initalization                      
	******************************************************** */

	ngOnInit(): void {
		// this.page_settings = this.getPageSettings();\
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
		Form                      
	******************************************************** */

	public onInvite(): void {
		!this.form_open() ? this.onOpenInvite() : this.onCloseInvite();
	}

	public onOpenInvite(): void {
		const today = DateTime.now();
		const now = DateTime.now();
		const eight_hours_from_now = now.plus({hours: 8});
		const expiration_time = eight_hours_from_now.hour;
		this.form_invite.reset();
		this.form_invite.get('role')?.setValue(UserRole.Reader);
		this.form_invite.get('expiration_enabled')?.setValue(true);
		this.form_invite.get('expiration_date')?.setValue(today);
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
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		const {label, role, expiration_enabled, expiration_date, expiration_time} = this.form_invite.value;
		console.log('label', label);
		console.log('role', role);
		console.log('expiration_enabled', expiration_enabled);
		console.log('expiration_date', expiration_date);
		console.log('expiration_time', expiration_time);
		// this.mintService.rotateMintKeysets(unit, input_fee_ppk, max_order).subscribe({
		// 	next: () => {
		// 		this.eventService.registerEvent(
		// 			new EventData({
		// 				type: 'SUCCESS',
		// 				message: 'Rotation complete!',
		// 			}),
		// 		);
		// 	},
		// 	error: (error: OrchardErrors) => {
		// 		this.eventService.registerEvent(
		// 			new EventData({
		// 				type: 'ERROR',
		// 				message: error.errors[0].message,
		// 			}),
		// 		);
		// 	},
		// });
	}

	private onSuccessEvent(): void {
		//d o something here
		// this.keysets_rotation = false;
		// this.cdr.detectChanges();
		// this.reloadDynamicData();
		// this.mintService.loadMintKeysets().subscribe((mint_keysets) => {
		// 	this.mint_keysets = mint_keysets;
		// 	this.resetForm();
		// });
	}
}
