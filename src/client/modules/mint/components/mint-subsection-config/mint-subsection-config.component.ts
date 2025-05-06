/* Core Dependencies */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
/* Application Dependencies */
import { MintService } from '@client/modules/mint/services/mint/mint.service';
import { MintQuoteTtls } from '@client/modules/mint/classes/mint-quote-ttls.class';
import { MintInfo } from '@client/modules/mint/classes/mint-info.class';
import { validateMicros } from '@client/modules/form/helpers/validate-micros';
/* Shared Dependencies */
import { OrchardNut4Method, OrchardNut5Method } from '@shared/generated.types';

@Component({
  selector: 'orc-mint-subsection-config',
  standalone: false,
  templateUrl: './mint-subsection-config.component.html',
  styleUrl: './mint-subsection-config.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintSubsectionConfigComponent implements OnInit, OnDestroy {

	public mint_info: MintInfo | null = null;
	public quote_ttls!: MintQuoteTtls;
	public minting_units: string[] = [];
	public melting_units: string[] = [];

	public form_config: FormGroup = new FormGroup({
		minting: new FormGroup({
			supported: new FormControl(),
			mint_ttl: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(3600), validateMicros]),
		}),
		melting: new FormGroup({
			supported: new FormControl(),
			melt_ttl: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(3600), validateMicros]),
		}),
	});

	public get form_minting(): FormGroup {
		return this.form_config.get('minting') as FormGroup;
	}

	public get form_melting(): FormGroup {
		return this.form_config.get('melting') as FormGroup;
	}

	// private test: FormGroup = new FormGroup({
	// 	minting: new FormGroup({
	// 		disabled: new FormControl(),
	// 		quote_ttl: new FormControl(),
	// 		sat: new FormGroup({
	// 			bolt11:  new FormGroup({
	// 				max_amount: new FormControl(),
	// 				min_amount: new FormControl(),
	// 				description: new FormControl(),
	// 			}),				
	// 		}),
	// 		usd: new FormGroup({
	// 			bolt11:  new FormGroup({
	// 				max_amount: new FormControl(),
	// 				min_amount: new FormControl(),
	// 				description: new FormControl(),
	// 			}),
	// 		}),
	// 	}),
	// 	melting: new FormGroup({
	// 		disabled: new FormControl(),
	// 		quote_ttl: new FormControl(),
	// 		sat: new FormGroup({
	// 			bolt11:  new FormGroup({
	// 				max_amount: new FormControl(),
	// 				min_amount: new FormControl(),
	// 				amountless: new FormControl(),
	// 			}),
	// 		}),
	// 		usd: new FormGroup({
	// 			bolt11:  new FormGroup({
	// 				max_amount: new FormControl(),
	// 				min_amount: new FormControl(),
	// 				amountless: new FormControl(),
	// 			}),
	// 		}),
	// 	}),
	// });

	constructor(
		public mintService: MintService,
		public route: ActivatedRoute,
	) {}

	ngOnInit(): void {	
		this.mint_info = this.route.snapshot.data['mint_info'];
		this.quote_ttls = this.route.snapshot.data['mint_quote_ttl'];
		this.patchStaticFormElements();
		this.minting_units = this.getUniqueUnits('nut4');
		this.melting_units = this.getUniqueUnits('nut5');
		this.buildDynamicFormElements();
	}

	private patchStaticFormElements(): void {
		this.form_config.patchValue({
			minting: {
				supported: !this.mint_info?.nuts.nut4.disabled,
				mint_ttl: this.translateQuoteTtl(this.quote_ttls.mint_ttl),
			},
			melting: {
				supported: !this.mint_info?.nuts.nut5.disabled,
				melt_ttl: this.translateQuoteTtl(this.quote_ttls.melt_ttl),
			},
		});
	}

	private translateQuoteTtl(quote_ttl: number | null): number | null {
		return (quote_ttl) ? (quote_ttl/1000) : null;
	}

	private getUniqueUnits(nut: 'nut4' | 'nut5'): string[] {
		const unit_set = new Set<string>();
		this.mint_info?.nuts[nut].methods.forEach( method => unit_set.add(method.unit));
		return Array.from(unit_set);
	}

	private buildDynamicFormElements(): void {
		this.minting_units.forEach(unit => {
			this.form_minting.addControl(unit, new FormGroup({}));
			this.mint_info?.nuts.nut4.methods
				.filter( method => method.unit === unit)
				.forEach( method => {
					(this.form_minting.get(unit) as FormGroup).addControl(method.method, new FormGroup({
						min_amount: new FormControl(method.min_amount),
						max_amount: new FormControl(method.max_amount),
						description: new FormControl(method.description),
					}));
				});
		});
		this.melting_units.forEach(unit => {
			this.form_melting.addControl(unit, new FormGroup({}));
			this.mint_info?.nuts.nut5.methods
				.filter( method => method.unit === unit)
				.forEach( method => {
					(this.form_melting.get(unit) as FormGroup).addControl(method.method, new FormGroup({
						min_amount: new FormControl(method.min_amount),
						max_amount: new FormControl(method.max_amount),
						amountless: new FormControl(method.amountless),
					}));
				});
		});
	}

	public onTtlCancel(
		{
			form_group,
			control_name
		}: {
			form_group: FormGroup,
			control_name: keyof MintQuoteTtls
		}): void {
		if(!control_name) return;
		form_group.get(control_name)?.markAsPristine();
		form_group.get(control_name)?.setValue(this.translateQuoteTtl(this.quote_ttls[control_name]));
	}

	public onTtlUpdate(
		{
			form_group,
			control_name
		}: {
			form_group: FormGroup,
			control_name: keyof MintQuoteTtls
		}): void {
		// if(!control_name) return;
		// form_group.get(control_name)?.markAsDirty();
		// form_group.get(control_name)?.setValue(this.quote_ttls[control_name]);
	}

	public onMethodUpdate(
		{
			nut,
			unit,
			method,
			form_group,
			control_name
		}: {
			nut: 'nut4' | 'nut5',
			unit: string,
			method: string,
			form_group: FormGroup,
			control_name: keyof OrchardNut4Method | keyof OrchardNut5Method
		}
	): void {
		console.log(control_name);
	}

	public onMethodCancel(
		{
			nut,
			unit,
			method,
			form_group,
			control_name
		}: {
			nut: 'nut4' | 'nut5',
			unit: string,
			method: string,
			form_group: FormGroup,
			control_name: keyof OrchardNut4Method | keyof OrchardNut5Method
		}
	): void {
		form_group.get(unit)?.get(method)?.get(control_name)?.markAsPristine();
		const nut_method = this.mint_info?.nuts[nut].methods.find( nut_method => nut_method.unit === unit && nut_method.method === method );
		let old_val = (nut === 'nut4') ? (nut_method as OrchardNut4Method)?.[control_name as keyof OrchardNut4Method] : (nut_method as OrchardNut5Method)?.[control_name as keyof OrchardNut5Method];
		form_group.get(unit)?.get(method)?.get(control_name)?.setValue(old_val);
	}

	ngOnDestroy(): void {}
}