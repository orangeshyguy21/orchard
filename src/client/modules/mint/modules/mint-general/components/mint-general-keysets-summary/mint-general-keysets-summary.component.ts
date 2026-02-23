/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
/* Application Dependencies */
import {MintKeyset} from '@client/modules/mint/classes/mint-keyset.class';
import {MintKeysetProofCount} from '@client/modules/mint/classes/mint-keyset-proof-count.class';

@Component({
	selector: 'orc-mint-general-keysets-summary',
	standalone: false,
	templateUrl: './mint-general-keysets-summary.component.html',
	styleUrl: './mint-general-keysets-summary.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralKeysetsSummaryComponent {
	public keysets = input.required<MintKeyset[]>();
	public proof_counts = input.required<MintKeysetProofCount[]>();
	public loading = input.required<boolean>();

	/** Number of active keysets. */
	public active_count = computed(() => this.keysets().filter((k) => k.active).length);

	/** Number of inactive keysets. */
	public inactive_count = computed(() => this.keysets().filter((k) => !k.active).length);

	/** Percentage of keysets that are active. */
	public active_ratio = computed(() => {
		const total = this.keysets().length;
		return total > 0 ? (this.active_count() / total) * 100 : 0;
	});

	/** Unique currency units in use across all keysets. */
	public units_in_use = computed(() => {
		const unit_set = new Set(this.keysets().map((k) => k.unit));
		return Array.from(unit_set);
	});

	/** Total blind signature denominations across all keysets. */
	public total_blind_sigs = computed(() => this.keysets().reduce((sum, k) => sum + (k.amounts?.length ?? 0), 0));

	/** Total proof count across all keysets. */
	public total_proof_count = computed(() => this.proof_counts().reduce((sum, pc) => sum + pc.count, 0));
}
