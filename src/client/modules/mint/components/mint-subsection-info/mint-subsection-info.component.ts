/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ChangeDetectorRef, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
/* Vendor Dependencies */
import { Subscription } from 'rxjs';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintInfoRpc } from '@client/modules/mint/classes/mint-info-rpc.class';
import { AiService } from '@client/modules/ai/services/ai/ai.service';
import { AiChatToolCall } from '@client/modules/ai/classes/ai-chat-chunk.class';
import { EventService } from '@client/modules/event/services/event/event.service';
import { EventData } from '@client/modules/event/classes/event-data.class';
/* Shared Dependencies */
import { AiAgent, AiFunctionName, OrchardContact } from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-info',
	standalone: false,
	templateUrl: './mint-subsection-info.component.html',
	styleUrl: './mint-subsection-info.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionInfoComponent implements OnInit, OnDestroy {

	public init_info!: MintInfoRpc;
	public form_info: FormGroup = new FormGroup({
		name: new FormControl(null, Validators.maxLength(200)),
		description: new FormControl(),
		icon_url: new FormControl(),
		description_long: new FormControl(),
		motd: new FormControl(),
		urls: new FormArray([]),
		contact: new FormArray([]),
	});

	public get form_array_urls(): FormArray {
		return this.form_info.get('urls') as FormArray;
	}

	public get form_array_contacts(): FormArray {
		return this.form_info.get('contact') as FormArray;
	}

	private subscriptions: Subscription = new Subscription();
	private active_event: EventData | null = null;
	private dirty_count: WritableSignal<number> = signal(0);
	private dirty_count$ = toObservable(this.dirty_count);

	constructor(
		public mintService: MintService,
		public route: ActivatedRoute,
		public aiService: AiService,
		public eventService: EventService,
		public cdr: ChangeDetectorRef
	) {}

	async ngOnInit(): Promise<void> {
		this.aiService.active_agent = AiAgent.MintInfo;
		this.init_info = this.route.snapshot.data['mint_info_rpc'];		
		this.form_info.patchValue({
			name: this.init_info.name,
			description: this.init_info.description,
			icon_url: this.init_info.icon_url,
			description_long: this.init_info.description_long,
			motd: this.init_info.motd,
		});
		if (this.init_info.urls && Array.isArray(this.init_info.urls)) {
			const url_controls = this.init_info.urls.map(url => new FormControl(url, [Validators.required]));
			url_controls.forEach(control => this.form_array_urls.push(control));
		}
		if (this.init_info.contact && Array.isArray(this.init_info.contact)) {
			const contact_controls = this.init_info.contact.map(contact => new FormGroup({
				method: new FormControl(contact.method, [Validators.required]),
				info: new FormControl(contact.info, [Validators.required]),
			}));
			contact_controls.forEach(control => this.form_array_contacts.push(control));
		}
		const tool_subscription = this.getToolSubscription();
		const event_subscription = this.getEventSubscription();
		const form_subscription = this.getFormSubscription();
		const dirty_count_subscription = this.getDirtyCountSubscription();
		this.subscriptions.add(tool_subscription);	
		this.subscriptions.add(event_subscription);
		this.subscriptions.add(form_subscription);
		this.subscriptions.add(dirty_count_subscription);
	}

	private getToolSubscription(): Subscription {
		return this.aiService.tool_calls$
			.subscribe((tool_call: AiChatToolCall) => {
				this.executeAgentFunction(tool_call);
			});
	}

	private getEventSubscription(): Subscription {
		return this.eventService.getActiveEvent()
			.subscribe((event_data: EventData | null) => {
				this.active_event = event_data;
				if( event_data?.confirmed ) this.onConfirmedEvent();
			});
	}

	private getFormSubscription(): Subscription {
		return this.form_info.valueChanges.subscribe(() => {
			const count = Object.keys(this.form_info.controls).filter(key => this.form_info.get(key)?.dirty).length;
			this.dirty_count.set(count);
			this.cdr.detectChanges();
		});
	}

	private getDirtyCountSubscription(): Subscription {
		return this.dirty_count$.subscribe((count) => {
			this.createPendingEvent(count);
		});
	}

	private executeAgentFunction(tool_call: AiChatToolCall): void {
		if( tool_call.function.name === AiFunctionName.MintNameUpdate ) {
			this.form_info.get('name')?.setValue(tool_call.function.arguments.name);
			this.form_info.get('name')?.markAsDirty();
			this.cdr.detectChanges();
		}
		if( tool_call.function.name === AiFunctionName.MintMotdUpdate ) {
			this.form_info.get('motd')?.setValue(tool_call.function.arguments.motd);
			this.form_info.get('motd')?.markAsDirty();
			this.cdr.detectChanges();
		}
	}

	private createPendingEvent(count: number): void {
		if( count === 0 && this.active_event?.type !== 'PENDING' ) return;
		if( count === 0 ) return this.eventService.registerEvent(null);
		this.eventService.registerEvent(new EventData({
			type: 'PENDING',
			message: count.toString(),
		}));
	}

	public onAddUrlControl(): void {
		this.form_array_urls.push(new FormControl(null, [Validators.required]));
	}

	public onAddContactControl(): void {
		this.form_array_contacts.push(new FormGroup({
			method: new FormControl(null, [Validators.required]),
			info: new FormControl(null, [Validators.required]),
		}));
	}

	public onControlUpdate(control_name: keyof MintInfoRpc): void {
		if( this.form_info.get(control_name)?.invalid ) return;
		this.form_info.get(control_name)?.markAsPristine();
		const control_value = this.form_info.get(control_name)?.value;
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		if( control_name === 'name' ) return this.updateMintName(control_value);
		if( control_name === 'description' ) return this.updateMintDescription(control_value);
		if( control_name === 'description_long' ) return this.updateMintDescriptionLong(control_value);
		if( control_name === 'icon_url' ) return this.updateMintIcon(control_value);
		if( control_name === 'motd' ) return this.updateMintMotd(control_value);
	}

	public onArrayControlUpdate({array_name, control_index}: {array_name: keyof MintInfoRpc, control_index: number}): void {
		const array_group = this.form_info.get(array_name) as FormArray;
		if( array_group.at(control_index).invalid ) return;
		array_group.at(control_index).markAsPristine();
		const original_value = (this.init_info[array_name] && Array.isArray(this.init_info[array_name])) ? this.init_info[array_name][control_index] : null;
		const control_value = array_group.at(control_index).value;
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		if( array_name === 'urls' ){
			if( original_value ) return this.updateMintUrl(control_index, control_value, original_value);
			return this.addMintUrl(control_value);
		}
		if( array_name === 'contact' ){
			if( original_value ) return this.updateMintContact(control_index, control_value, original_value);
			return this.addMintContact(control_value);
		}
	}

	public onArrayControlRemove({array_name, control_index}: {array_name: keyof MintInfoRpc, control_index: number}): void {
		const array_group = this.form_info.get(array_name) as FormArray;
		const control_value = array_group.at(control_index).value;
		const original_value = (this.init_info[array_name] && Array.isArray(this.init_info[array_name])) ? this.init_info[array_name][control_index] : null;
		if( !original_value ) return array_group.removeAt(control_index);
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		if( array_name === 'urls' ) return this.removeMintUrl(control_index, control_value);
		if( array_name === 'contact' ) return this.removeMintContact(control_index, control_value);
	}
	

	private onConfirmedEvent(): void {
		if (this.form_info.invalid) {
			return this.eventService.registerEvent(new EventData({
				type: 'WARNING',
				message: 'Invalid info data',
			}));
		}
		this.eventService.registerEvent(new EventData({type: 'SAVING'}));
		const mutation_parts: string[] = [];
		const mutation_variables: Record<string, any> = {};
		if (this.form_info.get('name')?.dirty) {
			mutation_parts.push(`
				mint_name_update(mint_name_update: { name: $name }) {
					name
				}
			`);
			mutation_variables['name'] = this.form_info.get('name')?.value;
		}
		if (this.form_info.get('description')?.dirty) {
			mutation_parts.push(`
				mint_short_description_update(mint_desc_update: { description: $description }) {
					description
				}
			`);
			mutation_variables['description'] = this.form_info.get('description')?.value;
		}
		if (this.form_info.get('description_long')?.dirty) {
			mutation_parts.push(`
				mint_long_description_update(mint_desc_update: { description: $description_long }) {
					description
				}
			`);
			mutation_variables['description_long'] = this.form_info.get('description_long')?.value;
		}
		if (this.form_info.get('icon_url')?.dirty) {
			mutation_parts.push(`
				mint_icon_update(mint_icon_update: { icon_url: $icon_url }) {
					icon_url
				}
			`);
			mutation_variables['icon_url'] = this.form_info.get('icon_url')?.value;
		}
		if (this.form_info.get('motd')?.dirty) {
			mutation_parts.push(`
				mint_motd_update(mint_motd_update: { motd: $motd }) {
					motd
				}
			`);
			mutation_variables['motd'] = this.form_info.get('motd')?.value;
		}

		const urls_array = this.form_info.get('urls') as FormArray;
		if (urls_array?.dirty) {
			const new_urls = urls_array.value.filter(Boolean);
			const old_urls = this.init_info.urls || [];
			const urls_to_add = new_urls.filter((url: string) => !old_urls.includes(url));
			urls_to_add.forEach((url: string, index: number) => {
				const mutation_var = `url_add_${index}`;
				mutation_parts.push(`
					url_add_${index}: mint_url_add(mint_url_update: { url: $${mutation_var} }) {
						url
					}
				`);
				mutation_variables[`${mutation_var}`] = url;
			});
			const urls_to_remove = old_urls.filter(url => !new_urls.includes(url));
			urls_to_remove.forEach((url: string, index: number) => {
				const mutation_var = `url_remove_${index}`;
				mutation_parts.push(`
					url_remove_${index}: mint_url_remove(mint_url_update: { url: $${mutation_var} }) {
						url
					}
				`);
				mutation_variables[`${mutation_var}`] = url;
			});
		}

		const contacts_array = this.form_info.get('contact') as FormArray;
		if (contacts_array?.dirty) {
			const new_contacts = contacts_array.value.filter((c: OrchardContact) => c.method && c.info);
			const old_contacts = this.init_info.contact || [];
			const contacts_to_add = new_contacts.filter((contact: OrchardContact) => 
				!old_contacts.some(old => old.method === contact.method && old.info === contact.info)
			);
			contacts_to_add.forEach((contact: OrchardContact, index: number) => {
				const mutation_var = `contact_add_${index}`;
				mutation_parts.push(`
					contact_add_${index}: mint_contact_add(mint_contact_update: { method: $${mutation_var}_method, info: $${mutation_var}_info }) {
						method
						info
					}
				`);
				mutation_variables[`${mutation_var}_method`] = contact.method;
				mutation_variables[`${mutation_var}_info`] = contact.info;
			});
			const contacts_to_remove = old_contacts.filter(old => 
				!new_contacts.some((contact:OrchardContact) => contact.method === old.method && contact.info === old.info)
			);
			contacts_to_remove.forEach((contact: OrchardContact, index: number) => {
				const mutation_var = `contact_remove_${index}`;
				mutation_parts.push(`
					contact_remove_${index}: mint_contact_remove(mint_contact_update: { method: $${mutation_var}_method, info: $${mutation_var}_info }) {
						method
						info
					}
				`);
				mutation_variables[`${mutation_var}_method`] = contact.method;
				mutation_variables[`${mutation_var}_info`] = contact.info;
			});
		}

		if (mutation_parts.length === 0) return;

		const mutation = `
			mutation BulkMintUpdate(${
				Object.keys(mutation_variables)
					.map(key => `$${key}: String!`)
					.join(', ')
			}) {
				${mutation_parts.join('\n')}
			}
		`;

		this.mintService.updateMint(mutation, mutation_variables).subscribe({
			next: (response) => {
				console.log('response', response);
				this.mintService.getMintInfo().subscribe((mint_info: MintInfoRpc) => {
					this.init_info = mint_info;
					this.cdr.detectChanges();
				});
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintName(control_value: string): void {
		this.mintService.updateMintName(control_value).subscribe({
			next: (response) => {
				this.init_info.name = response.mint_name_update.name ?? null;
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintDescription(control_value: string): void {
		this.mintService.updateMintDescription(control_value).subscribe({
			next: (response) => {
				this.init_info.description = response.mint_short_description_update.description ?? null;
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	public updateMintDescriptionLong(control_value: string): void {
		this.mintService.updateMintDescriptionLong(control_value).subscribe({
			next: (response) => {
				this.init_info.description_long = response.mint_long_description_update.description ?? null;
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}
	private updateMintIcon(control_value: string): void {
		this.mintService.updateMintIcon(control_value).subscribe({
			next: (response) => {
				this.init_info.icon_url = response.mint_icon_update.icon_url ?? null;
				this.cdr.detectChanges();
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintMotd(control_value: string): void {
		this.mintService.updateMintMotd(control_value).subscribe({
			next: (response) => {
				this.init_info.motd = response.mint_motd_update.motd ?? null;
				this.cdr.detectChanges();
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintUrl(control_index: number, control_value: string, original_value: string): void {
		this.mintService.updateMintUrl(control_value, original_value).subscribe({
			next: (response) => {
				this.init_info.urls[control_index] = response.mint_url_add.url ?? null;
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private addMintUrl(control_value: string): void {
		this.mintService.addMintUrl(control_value).subscribe({
			next: (response) => {
				this.init_info.urls.push(response.mint_url_add.url ?? null);
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private removeMintUrl(control_index: number, control_value: string): void {
		this.mintService.removeMintUrl(control_value).subscribe({
			next: (response) => {
				this.init_info.urls.splice(control_index, 1);
				this.form_array_urls.removeAt(control_index);
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private updateMintContact(control_index: number, control_value: OrchardContact, original_value: OrchardContact): void {
		this.mintService.updateMintContact(control_value, original_value).subscribe({
			next: (response) => {
				const contact = response.mint_contact_add;
				this.init_info.contact[control_index] = {
					method: contact.method,
					info: contact.info,
				};
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private removeMintContact(control_index: number, control_value: OrchardContact): void {
		this.mintService.removeMintContact(control_value).subscribe({
			next: (response) => {
				this.init_info.contact.splice(control_index, 1);
				this.form_array_contacts.removeAt(control_index);
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private addMintContact(control_value: OrchardContact): void {
		this.mintService.addMintContact(control_value).subscribe({
			next: (response) => {
				const contact = response.mint_contact_add;
				this.init_info.contact.push({
					method: contact.method,
					info: contact.info,
				});
				this.onSuccess();
			},
			error: (error) => {
				this.onError(error.message);
			}
		});
	}

	private onSuccess(): void {
		this.mintService.clearInfoCache();
		this.mintService.loadMintInfo().subscribe();
		this.eventService.registerEvent(new EventData({type: 'SUCCESS'}));
		this.form_info.markAsPristine(); // @todo this is suss for a single update control
		this.dirty_count.set(0); // @todo this is suss for a single update control
	}

	private onError(error: string): void {
		this.eventService.registerEvent(new EventData({
			type: 'ERROR',
			message: error
		}));
	}

	public onControlCancel(control_name: keyof MintInfoRpc): void {
		if(!control_name) return;
		this.form_info.get(control_name)?.markAsPristine();
		this.form_info.get(control_name)?.setValue(this.init_info[control_name]);
	}

	public onArrayControlCancel({array_name, control_index}: {array_name: keyof MintInfoRpc, control_index: number}): void {
		if(!array_name) return;
		const array_group = this.form_info.get(array_name) as FormArray;
		const original_value = (this.init_info[array_name] && Array.isArray(this.init_info[array_name])) ? this.init_info[array_name][control_index] : null;
		array_group.at(control_index).markAsPristine();
		array_group.at(control_index).setValue(original_value);
	}

	ngOnDestroy(): void {
		this.subscriptions.unsubscribe();
	}
}