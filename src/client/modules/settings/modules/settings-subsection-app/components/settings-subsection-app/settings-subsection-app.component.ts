/* Core Dependencies */
import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
	WritableSignal,
	signal,
	effect,
	inject,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ElementRef,
	viewChild,
	viewChildren,
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {SettingAppService, ParsedAppSettings} from '@client/modules/settings/services/setting-app/setting-app.service';
import {SettingDeviceService} from '@client/modules/settings/services/setting-device/setting-device.service';
import {EventService} from '@client/modules/event/services/event/event.service';
import {EventData} from '@client/modules/event/classes/event-data.class';
import {OrchardErrors} from '@client/modules/error/classes/error.class';
import {DeviceType} from '@client/modules/layout/types/device.types';
import {NavTertiaryItem} from '@client/modules/nav/types/nav-tertiary-item.type';
import {NonNullableSettingsAppSettings} from '@client/modules/settings/types/setting.types';
import {OrchardValidators} from '@client/modules/form/validators';
/* Shared Dependencies */
import {SettingKey} from '@shared/generated.types';

enum NavTertiary {
	Bitcoin = 'nav1',
	AI = 'nav2',
}

@Component({
	selector: 'orc-settings-subsection-app',
	standalone: false,
	templateUrl: './settings-subsection-app.component.html',
	styleUrl: './settings-subsection-app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSubsectionAppComponent implements OnInit, AfterViewInit, OnDestroy {
	private configService = inject(ConfigService);
	private settingAppService = inject(SettingAppService);
	private settingDeviceService = inject(SettingDeviceService);
	private eventService = inject(EventService);
	private breakpointObserver = inject(BreakpointObserver);

	readonly nav_elements = viewChildren<ElementRef>('nav1,nav2');
	readonly settings_container = viewChild<ElementRef>('settings_container');

	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	public form_app_settings: FormGroup = new FormGroup({
		form_bitcoin: new FormGroup({
			oracle_enabled: new FormControl(false, [Validators.required]),
		}),
		form_ai: new FormGroup({
			enabled: new FormControl(false, [Validators.required]),
			vendor: new FormControl('ollama'),
			ollama_api: new FormControl('http://localhost:11434', [OrchardValidators.url]),
			openrouter_key: new FormControl('', [OrchardValidators.openrouterKey]),
		}),
        form_ai_messaging: new FormGroup({
            enabled: new FormControl(false, [Validators.required]),
            telegram_bot_token: new FormControl('', [OrchardValidators.telegramBotToken]),
        }),
	});
	public bitcoin_enabled = this.configService.config.bitcoin.enabled;
	public device_type = signal<DeviceType>('desktop');
	public page_settings = signal<NonNullableSettingsAppSettings | null>(null);
	public initial_settings = signal<ParsedAppSettings | null>(null);

	readonly tertiary_nav_items: Record<NavTertiary, NavTertiaryItem> = {
		[NavTertiary.Bitcoin]: {title: 'Bitcoin'},
		[NavTertiary.AI]: {title: 'AI'},
	};

	private readonly setting_key_map: Record<string, SettingKey> = {
		'form_bitcoin.oracle_enabled': SettingKey.BitcoinOracle,
		'form_ai.enabled': SettingKey.AiEnabled,
		'form_ai.vendor': SettingKey.AiVendor,
		'form_ai.ollama_api': SettingKey.AiOllamaApi,
		'form_ai.openrouter_key': SettingKey.AiOpenrouterKey,
        'form_ai_messaging.enabled': SettingKey.MessagesEnabled,
        'form_ai_messaging.telegram_bot_token': SettingKey.MessagesTelegramBotToken,
	};

	private readonly initial_value_map: Record<string, keyof ParsedAppSettings> = {
		'form_bitcoin.oracle_enabled': 'bitcoin_oracle',
		'form_ai.enabled': 'ai_enabled',
		'form_ai.vendor': 'ai_vendor',
		'form_ai.ollama_api': 'ai_ollama_api',
		'form_ai.openrouter_key': 'ai_openrouter_key',
        'form_ai_messaging.enabled': 'messages_enabled',
        'form_ai_messaging.telegram_bot_token': 'messages_telegram_bot_token',
	};

	private active_event: EventData | null = null;
	private subscriptions: Subscription = new Subscription();
	private dirty_count: WritableSignal<number> = signal(0);

	constructor() {
		effect(() => {
			this.createPendingEvent(this.dirty_count());
		});
	}

	ngOnInit(): void {
		this.subscriptions.add(this.getEventSubscription());
		this.subscriptions.add(this.getBreakpointSubscription());
		this.subscriptions.add(this.getFormChangesSubscription());
		this.page_settings.set(this.getPageSettings());
		this.getSettings();
	}

	ngAfterViewInit(): void {
		this.updateTertiaryNav();
	}

	/* *******************************************************
		Settings
	******************************************************** */

	private getPageSettings(): NonNullableSettingsAppSettings {
		const settings = this.settingDeviceService.getSettingsAppSettings();
		return {
			tertiary_nav: settings.tertiary_nav ?? Object.values(NavTertiary),
		};
	}

	private getSettings(): void {
		this.initial_settings.set(this.settingAppService.getParsedSettings());
		const initial_settings = this.initial_settings();
		if (!initial_settings) return;
		this.initSettingForms(initial_settings);
	}

	/* *******************************************************
		Subscriptions
	******************************************************** */

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent().subscribe((event_data: EventData | null) => {
			this.active_event = event_data;
			if (event_data === null) this.evaluateDirtyCount();
			if (event_data && event_data.confirmed !== null) {
				event_data.confirmed ? this.onConfirmedEvent() : this.onUnconfirmedEvent();
			}
		});
	}

	private getBreakpointSubscription(): Subscription {
		return this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]).subscribe((result) => {
			if (result.breakpoints[Breakpoints.XSmall]) {
				this.device_type.set('mobile');
			} else if (result.breakpoints[Breakpoints.Small] || result.breakpoints[Breakpoints.Medium]) {
				this.device_type.set('tablet');
			} else {
				this.device_type.set('desktop');
			}
		});
	}

	private getFormChangesSubscription(): Subscription {
		return this.form_app_settings.valueChanges.subscribe(() => {
			this.evaluateDirtyCount();
            this.toggleAiControls(this.form_ai.get('enabled')?.value ?? false);
            this.toggleMessagingControls(this.form_ai_messaging.get('enabled')?.value ?? false);
		});
	}

	/* *******************************************************
		Forms
	******************************************************** */

	public get form_bitcoin(): FormGroup {
		return this.form_app_settings.get('form_bitcoin') as FormGroup;
	}

	public get form_ai(): FormGroup {
		return this.form_app_settings.get('form_ai') as FormGroup;
	}

    public get form_ai_messaging(): FormGroup {
        return this.form_app_settings.get('form_ai_messaging') as FormGroup;
    }

	private initSettingForms(settings: ParsedAppSettings): void {
		this.form_bitcoin.patchValue({
			oracle_enabled: settings.bitcoin_oracle,
		});
		this.form_ai.patchValue({
			enabled: settings.ai_enabled,
			vendor: settings.ai_vendor,
			ollama_api: settings.ai_ollama_api,
			openrouter_key: settings.ai_openrouter_key,
		});
        this.form_ai_messaging.patchValue({
            enabled: settings.messages_enabled,
            telegram_bot_token: settings.messages_telegram_bot_token,
        });
        this.toggleAiControls(settings.ai_enabled);
        this.toggleMessagingControls(settings.messages_enabled);
	}

    /** Enables or disables AI vendor controls based on the enabled state */
	private toggleAiControls(enabled: boolean): void {
		const ollama_api = this.form_ai.get('ollama_api');
		const openrouter_key = this.form_ai.get('openrouter_key');
		if (enabled) {
			ollama_api?.enable({emitEvent: false});
			openrouter_key?.enable({emitEvent: false});
		} else {
			ollama_api?.disable({emitEvent: false});
			openrouter_key?.disable({emitEvent: false});
		}
	}
    private toggleMessagingControls(enabled: boolean): void {
        const telegram_bot_token = this.form_ai_messaging.get('telegram_bot_token');
        if (enabled) {
            telegram_bot_token?.enable({emitEvent: false});
        } else {
            telegram_bot_token?.disable({emitEvent: false});
        }
    }

	public onUpdate(): void {
		this.evaluateDirtyCount();
	}

	private evaluateDirtyCount(): void {
		let control_count = 0;
		Object.keys(this.form_app_settings.controls).forEach((group_key) => {
			const group = this.form_app_settings.get(group_key) as FormGroup;
			control_count += Object.keys(group.controls)
				.filter((key) => group.get(key) instanceof FormControl)
				.filter((key) => group.get(key)?.dirty).length;
		});
		this.dirty_count.set(control_count);
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
		const keys: SettingKey[] = [];
		const values: string[] = [];
		for (const [path, setting_key] of Object.entries(this.setting_key_map)) {
			const control = this.form_app_settings.get(path);
			if (control?.dirty) {
				if (control.invalid) {
					return this.eventService.registerEvent(
						new EventData({
							type: 'WARNING',
							message: 'Invalid info',
						}),
					);
				}
				keys.push(setting_key);
				values.push(control.value.toString());
			}
		}
		if (keys.length === 0) return;
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.settingAppService.updateSettings(keys, values).subscribe({
			next: () => {
				this.eventService.registerEvent(
					new EventData({
						type: 'SUCCESS',
						message: 'Settings updated!',
					}),
				);
				this.form_app_settings.markAsPristine();
				this.evaluateDirtyCount();
				this.getSettings();
			},
			error: (errors: OrchardErrors) => {
				this.eventService.registerEvent(
					new EventData({
						type: 'ERROR',
						message: errors.errors[0].getFullError(),
					}),
				);
			},
		});
	}

	private onUnconfirmedEvent(): void {
		const initial_settings = this.initial_settings();
		if (initial_settings) this.initSettingForms(initial_settings);
		setTimeout(() => {
			this.form_app_settings.markAsPristine();
			this.form_app_settings.markAsUntouched();
			this.evaluateDirtyCount();
		}, 100);
	}

	/** Submit a single control value to the server */
	public onSubmit(form: FormGroup, event: string): void {
		const group_name = this.getFormGroupName(form);
		if (!group_name) return;
		const path = `${group_name}.${event}`;
		const setting_key = this.setting_key_map[path];
		const control = form.get(event);
		if (!setting_key || !control) return;
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		this.settingAppService.updateSettings([setting_key], [control.value.toString()]).subscribe({
			next: () => {
				this.eventService.registerEvent(
					new EventData({
						type: 'SUCCESS',
						message: 'Setting updated!',
					}),
				);
				control.markAsPristine();
				control.markAsUntouched();
				this.evaluateDirtyCount();
				this.getSettings();
			},
			error: (errors: OrchardErrors) => {
				this.eventService.registerEvent(
					new EventData({
						type: 'ERROR',
						message: errors.errors[0].getFullError(),
					}),
				);
			},
		});
	}

	/** Reset a single control to its initial value */
	public onCancel(form: FormGroup, event: string): void {
		const group_name = this.getFormGroupName(form);
		if (!group_name) return;
		const path = `${group_name}.${event}`;
		const initial_key = this.initial_value_map[path];
		const initial_settings = this.initial_settings();
		const control = form.get(event);
		if (!initial_key || !initial_settings || !control) return;
		control.setValue(initial_settings[initial_key]);
		control.markAsPristine();
		control.markAsUntouched();
		this.evaluateDirtyCount();
	}

	private getFormGroupName(form: FormGroup): string | null {
		for (const [key, group] of Object.entries(this.form_app_settings.controls)) {
			if (group === form) return key;
		}
		return null;
	}

	/* *******************************************************
		Tertiary Nav
	******************************************************** */

	public onTertiaryNavChange(event: string[]): void {
		this.page_settings.update((settings) => (settings ? {...settings, tertiary_nav: event} : null));
		const current = this.page_settings();
		if (current) this.settingDeviceService.setSettingsAppSettings(current);
		this.updateTertiaryNav();
	}

	public onTertiaryNavSelect(event: string): void {
		this.scrollToSettings(event as NavTertiary);
	}

	private updateTertiaryNav(): void {
		const settings = this.page_settings();
		const container = this.settings_container();
		if (!settings || !container) return;
		const tertiary_nav = settings.tertiary_nav.map((area) => `"${area}"`).join(' ');
		container.nativeElement.style.gridTemplateAreas = `${tertiary_nav}`;
	}

	private scrollToSettings(nav_item: NavTertiary): void {
		const target_element = this.nav_elements().find((el) => el.nativeElement.classList.contains(nav_item));
		if (!target_element?.nativeElement) return;
		target_element.nativeElement.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest',
		});
	}

	/* *******************************************************
		Destroy
	******************************************************** */

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}
