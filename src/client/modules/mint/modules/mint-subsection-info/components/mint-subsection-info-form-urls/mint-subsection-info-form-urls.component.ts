/* Core Dependencies */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, input, output, signal} from '@angular/core';
import {FormGroup, FormArray} from '@angular/forms';
/* Vendor Dependencies */
import {Subscription} from 'rxjs';
/* Application Dependencies */
import {MintInfoRpc} from '@client/modules/mint/classes/mint-info-rpc.class';

@Component({
	selector: 'orc-mint-subsection-info-form-urls',
	standalone: false,
	templateUrl: './mint-subsection-info-form-urls.component.html',
	styleUrl: './mint-subsection-info-form-urls.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionInfoFormUrlsComponent implements OnInit, OnDestroy {
	public form_group = input.required<FormGroup>(); // form group containing the urls controls
	public form_array = input.required<FormArray>(); // form array containing url entries
	public array_name = input.required<keyof MintInfoRpc>(); // name of the form array to bind
	public array_length = input.required<number>(); // current length of the form array

	public update = output<{array_name: keyof MintInfoRpc; control_index: number}>(); // emitted when a url is updated
	public cancel = output<{array_name: keyof MintInfoRpc; control_index: number}>(); // emitted when a url edit is cancelled
	public remove = output<{array_name: keyof MintInfoRpc; control_index: number}>(); // emitted when a url is removed
	public addControl = output<void>(); // emitted when a new url is added

	public added_index = signal<number | null>(null); // index of the newly added url
	public help_status = signal<boolean>(false); // tracks if the help is visible

	private subscription = new Subscription();

	constructor(private cdr: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.subscription.add(
			this.form_array().events.subscribe(() => {
				this.cdr.markForCheck();
			}),
		);
	}

	public onAddControl(): void {
		this.added_index.set(this.form_array().length);
		this.addControl.emit();
	}

	public onControlUpdate(index: number): void {
		this.update.emit({
			array_name: this.array_name(),
			control_index: index,
		});
	}

	public onControlCancel(index: number): void {
		this.cancel.emit({
			array_name: this.array_name(),
			control_index: index,
		});
	}

	public onControlRemove(index: number): void {
		this.remove.emit({
			array_name: this.array_name(),
			control_index: index,
		});
	}

    ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}
}
