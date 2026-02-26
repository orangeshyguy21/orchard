/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
/* Application Dependencies */
import {MintPulse} from '@client/modules/mint/classes/mint-pulse.class';

@Component({
	selector: 'orc-mint-general-health',
	standalone: false,
	templateUrl: './mint-general-health.component.html',
	styleUrl: './mint-general-health.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MintGeneralHealthComponent {
	public pulse = input.required<MintPulse | null>();
	public sparkline_data = input.required<number[]>();
	public mint_count_7d = input.required<number>();
	public melt_count_7d = input.required<number>();
	public swap_count_7d = input.required<number>();
	public mint_sparkline_7d = input.required<number[]>();
	public melt_sparkline_7d = input.required<number[]>();
	public swap_sparkline_7d = input.required<number[]>();
	public loading = input.required<boolean>();

	/** Total operations over the last 7 days. */
	public total_activity_7d = computed(() => this.mint_count_7d() + this.melt_count_7d() + this.swap_count_7d());

	/** Mint quote success rate as a percentage. */
	public mint_success_rate = computed(() => {
		const p = this.pulse();
		if (!p || p.mint_quote_rate.total === 0) return 0;
		return Math.round((p.mint_quote_rate.completed / p.mint_quote_rate.total) * 100);
	});

	/** Melt quote success rate as a percentage. */
	public melt_success_rate = computed(() => {
		const p = this.pulse();
		if (!p || p.melt_quote_rate.total === 0) return 0;
		return Math.round((p.melt_quote_rate.completed / p.melt_quote_rate.total) * 100);
	});

	/** Most recent activity timestamp across mint, melt, and swap. */
	public last_activity_time = computed(() => {
		const p = this.pulse();
		if (!p) return null;
		const times = [p.last_mint_time, p.last_melt_time, p.last_swap_time].filter((t): t is number => t !== null);
		return times.length > 0 ? Math.max(...times) : null;
	});

	/** Average mint quote completion time in seconds. */
	public avg_mint_time = computed(() => this.pulse()?.avg_mint_time ?? null);

	/** Average melt quote completion time in seconds. */
	public avg_melt_time = computed(() => this.pulse()?.avg_melt_time ?? null);

	/** Formats milliseconds to a human-readable duration string. */
	public formatDuration(ms: number | null): string {
		if (ms === null) return '--';
		if (ms < 1000) return `${ms}ms`;
		const seconds = Math.floor(ms / 1000);
		if (seconds < 60) return `${seconds}s`;
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
		return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
	}

	/** Maximum value in the sparkline data for scaling bars. */
	public sparkline_max = computed(() => {
		const data = this.sparkline_data();
		return data.length > 0 ? Math.max(...data) : 0;
	});

	/** Calculates bar height percentage for sparkline visualization. */
	public getBarHeight(value: number): number {
		const max = this.sparkline_max();
		if (max === 0) return 0;
		return (value / max) * 100;
	}
}
