/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
/* Application Dependencies */
import {GraphicStatusState} from '@client/modules/graphic/types/graphic-status.types';
import {MintInfo} from '@client/modules/mint/classes/mint-info.class';
import {MintQuoteTtls} from '@client/modules/mint/classes/mint-quote-ttls.class';

type NutGridItem = {
	num: number;
	label: string;
	status: GraphicStatusState;
};

@Component({
	selector: 'orc-mint-general-config-summary',
	standalone: false,
	templateUrl: './mint-general-config-summary.component.html',
	styleUrl: './mint-general-config-summary.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralConfigSummaryComponent {
	public info = input.required<MintInfo | null>();
	public quote_ttls = input.required<MintQuoteTtls | null>();
	public loading = input.required<boolean>();

	/** Grid of NUT specifications with their support status. */
	public nut_grid = computed<NutGridItem[]>(() => {
		const nuts = this.info()?.nuts;
		if (!nuts) return [];
		return [
			{num: 4, label: 'Mint', status: this.getNut4Status(nuts.nut4)},
			{num: 5, label: 'Melt', status: this.getNut5Status(nuts.nut5)},
			{num: 7, label: 'Check', status: nuts.nut7?.supported ? 'active' : 'inactive'},
			{num: 8, label: 'Overpay', status: nuts.nut8?.supported ? 'active' : 'inactive'},
			{num: 9, label: 'Restore', status: nuts.nut9?.supported ? 'active' : 'inactive'},
			{num: 10, label: 'Spend', status: nuts.nut10?.supported ? 'active' : 'inactive'},
			{num: 11, label: 'P2PK', status: nuts.nut11?.supported ? 'active' : 'inactive'},
			{num: 12, label: 'DLEQ', status: nuts.nut12?.supported ? 'active' : 'inactive'},
			{num: 14, label: 'HTLC', status: nuts.nut14?.supported ? 'active' : 'inactive'},
			{num: 15, label: 'MPP', status: nuts.nut15 ? 'active' : 'inactive'},
			{num: 17, label: 'WS', status: nuts.nut17 ? 'active' : 'inactive'},
			{num: 19, label: 'Cache', status: nuts.nut19 ? 'active' : 'inactive'},
			{num: 20, label: 'Sig', status: nuts.nut20?.supported ? 'active' : 'inactive'},
		];
	});

	/** Whether minting is disabled. */
	public minting_disabled = computed(() => this.info()?.nuts?.nut4?.disabled ?? false);

	/** Whether melting is disabled. */
	public melting_disabled = computed(() => this.info()?.nuts?.nut5?.disabled ?? false);

	/** Formats TTL seconds to a human-readable string. */
	public formatTtl(seconds: number | null): string {
		if (!seconds) return '--';
		if (seconds < 60) return `${seconds}s`;
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
		return `${Math.floor(seconds / 3600)}h`;
	}

	/** Determines NUT4 (minting) status. */
	private getNut4Status(nut4: {disabled: boolean} | null): GraphicStatusState {
		if (!nut4) return 'inactive';
		return nut4.disabled ? 'inactive' : 'active';
	}

	/** Determines NUT5 (melting) status. */
	private getNut5Status(nut5: {disabled: boolean} | null): GraphicStatusState {
		if (!nut5) return 'inactive';
		return nut5.disabled ? 'inactive' : 'active';
	}
}
