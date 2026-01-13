/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, effect, input, output, ViewChild} from '@angular/core';
/* Vendor Dependencies */
import {MatSort} from '@angular/material/sort';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';
import {NonNullableMintDatabaseSettings} from '@client/modules/settings/types/setting.types';
import {LightningRequest} from '@client/modules/lightning/classes/lightning-request.class';
/* Native Dependencies */
import {MintSubsectionDatabaseData} from '@client/modules/mint/modules/mint-subsection-database/classes/mint-subsection-database-data.class';
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintMintQuote} from '@client/modules/mint/classes/mint-mint-quote.class';
import {MintMeltQuote} from '@client/modules/mint/classes/mint-melt-quote.class';
/* Shared Dependencies */
import {MintQuoteState, MeltQuoteState} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-database-table',
	standalone: false,
	templateUrl: './mint-subsection-database-table.component.html',
	styleUrl: './mint-subsection-database-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionDatabaseTableComponent {
	@ViewChild(MatSort) sort!: MatSort;

	/* Inputs */
	public data = input.required<MintSubsectionDatabaseData>(); // table data source with type
	public page_settings = input.required<NonNullableMintDatabaseSettings>(); // pagination and filter settings
	public keysets = input.required<MintKeyset[]>(); // available keysets for ecash display
	public loading = input.required<boolean>(); // loading state for initial data
	public loading_more = input.required<boolean>(); // loading state for expanded row details
	public lightning_request = input.required<LightningRequest | null>(); // lightning request for invoice lookup
	public device_desktop = input.required<boolean>(); // mobile view flag

	/* Outputs */
	public updateRequest = output<string>(); // emits request string for invoice updates
	public setQuoteStatePaid = output<MintMintQuote | MintMeltQuote>(); // emits quote to mark as paid

	/* State */
	public more_entity!: MintMintQuote | MintMeltQuote | null; // currently expanded row entity
	public MintQuoteState = MintQuoteState;
	public MeltQuoteState = MeltQuoteState;

	/**
	 * Computes the displayed columns based on the data type
	 * @returns array of column names to display
	 */
	public displayed_columns = computed(() => {
		return this.getDisplayedColumns();
	});

	constructor(private configService: ConfigService) {
		effect(() => {
			const is_loading = this.loading();
			if (!is_loading) this.init();
		});
	}

	/**
	 * Initializes the table sort after data has loaded
	 */
	private init(): void {
		setTimeout(() => {
			this.data().source.sort = this.sort;
		});
	}

	private getDisplayedColumns(): string[] {
		const mobile = !this.device_desktop();
		const data_type = this.data().type;
		if (data_type === 'MintMints' || data_type === 'MintMelts') {
			if (mobile) return ['unit', 'amount', 'state'];
			return ['unit', 'amount', 'request', 'state', 'created_time', 'actions'];
		}

		if (data_type === 'MintProofGroups') {
			if (mobile) return ['unit', 'amount', 'ecash', 'state'];
			return ['unit', 'amount', 'ecash', 'state', 'created_time'];
		}
		if (data_type === 'MintPromiseGroups') {
			if (mobile) return ['unit', 'amount', 'ecash'];
			return ['unit', 'amount', 'ecash', 'created_time'];
		}
		if (mobile) return ['unit', 'amount', 'state'];
		return ['unit', 'amount', 'request', 'state', 'created_time'];
	}

	/**
	 * Toggles the expanded detail row for a quote entity
	 * @param entity - the quote to toggle
	 */
	public toggleMore(entity: MintMintQuote | MintMeltQuote): void {
		this.more_entity = this.more_entity === entity ? null : entity;
		if (!this.configService.config.lightning.enabled) return;
		if (this.more_entity) this.updateRequest.emit(this.more_entity.request);
	}

	/**
	 * Handles the set quote state to paid action
	 * @param event - mouse event to stop propagation
	 * @param entity - quote entity to mark as paid
	 */
	public onSetQuoteStatePaid(event: MouseEvent, entity: MintMintQuote | MintMeltQuote): void {
		event.stopPropagation();
		event.preventDefault();
		this.setQuoteStatePaid.emit(entity);
	}
}
