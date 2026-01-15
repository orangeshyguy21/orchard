/* Core Dependencies */
import {ChangeDetectionStrategy, Component, effect, input, output, signal, computed, viewChild} from '@angular/core';
/* Vendor Dependencies */
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
/* Application Dependencies */
import {NonNullableMintKeysetsSettings} from '@client/modules/settings/types/setting.types';
import {DeviceType} from '@client/modules/layout/types/device.types';
/* Native Dependencies */
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintAnalyticKeyset} from '@client/modules/mint/classes/mint-analytic.class';
import {MintKeysetProofCount} from '@client/modules/mint/classes/mint-keyset-proof-count.class';
/* Local Dependencies */
import {MintSubsectionKeysetsTableRow} from './mint-subsection-keysets-table-row.class';
/* Shared Dependencies */
import {MintUnit} from '@shared/generated.types';

@Component({
	selector: 'orc-mint-subsection-keysets-table',
	standalone: false,
	templateUrl: './mint-subsection-keysets-table.component.html',
	styleUrl: './mint-subsection-keysets-table.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintSubsectionKeysetsTableComponent {
	readonly sort = viewChild(MatSort);

	readonly keysets = input.required<MintKeyset[]>();
	readonly keysets_analytics = input.required<MintAnalyticKeyset[]>();
	readonly keysets_analytics_pre = input.required<MintAnalyticKeyset[]>();
	readonly keysets_proof_counts = input.required<MintKeysetProofCount[]>();
	readonly page_settings = input.required<NonNullableMintKeysetsSettings>();
	readonly loading = input.required<boolean>();
	readonly device_type = input.required<DeviceType>();

	readonly rotateKeyset = output<MintUnit>();

	readonly data_source = signal(new MatTableDataSource<MintSubsectionKeysetsTableRow>([]));
	public more_entity = signal<MintKeyset | null>(null); // currently expanded row entity

	public displayed_columns = computed(() => {
		const device_type = this.device_type();
		if (device_type === 'mobile') return ['keyset'];
		if (device_type === 'tablet') return ['keyset', 'input_fee_ppk', 'valid_from', 'balance'];
		return ['keyset', 'input_fee_ppk', 'valid_from', 'balance', 'fees', 'proofs', 'actions'];
	});

	constructor() {
		effect(() => {
			if (this.loading()) return;
			this.init();
		});

		effect(() => {
			const sort = this.sort();
			const source = this.data_source();
			if (sort && source.data.length) {
				source.sort = sort;
			}
		});
	}

	/**
	 * Initializes the data source with filtered and sorted keyset rows
	 */
	private init(): void {
		const status_filter = this.page_settings()?.status ?? [];
		const units_filter = this.page_settings()?.units ?? [];

		const keyset_rows = this.keysets()
			.filter((keyset) => this.page_settings()?.date_end >= keyset.valid_from)
			.filter((keyset) => !status_filter.length || status_filter.includes(keyset.active))
			.filter((keyset) => !units_filter.length || units_filter.includes(keyset.unit))
			.sort((a, b) => b.derivation_path_index - a.derivation_path_index)
			.map((keyset) => {
				const keyset_analytics = this.keysets_analytics().filter((analytic) => analytic.keyset_id === keyset.id);
				const keyset_analytics_pre = this.keysets_analytics_pre().filter((analytic) => analytic.keyset_id === keyset.id);
				const keyset_proof_count = this.keysets_proof_counts().find((proof_count) => proof_count.id === keyset.id);
				return new MintSubsectionKeysetsTableRow(keyset, keyset_analytics, keyset_analytics_pre, keyset_proof_count);
			});

		this.data_source.set(new MatTableDataSource(keyset_rows));
	}

	/**
	 * Toggles the expanded detail row for a quote entity
	 * @param entity - the quote to toggle
	 */
	public toggleMore(entity: MintKeyset): void {
		this.more_entity.set(this.more_entity() === entity ? null : entity);
	}
}
