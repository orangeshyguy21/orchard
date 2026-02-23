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

	/** Most recent activity timestamp across all operation types. */
	public last_activity_time = computed<number | null>(() => {
		const p = this.pulse();
		if (!p) return null;
		const times = [p.last_mint_time, p.last_melt_time, p.last_swap_time].filter((t): t is number => t !== null);
		return times.length > 0 ? Math.max(...times) : null;
	});

	/** Maximum value in the sparkline data for scaling bars. */
	public sparkline_max = computed(() => {
		const data = this.sparkline_data();
		return data.length > 0 ? Math.max(...data) : 0;
	});

	/** Formats a unix timestamp into a relative time string. */
	public formatRelativeTime(timestamp: number | null): string {
		if (!timestamp) return 'No activity';
		const now = Math.floor(Date.now() / 1000);
		const diff = now - timestamp;
		if (diff < 0) return 'Just now';
		if (diff < 60) return `${diff}s ago`;
		if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
		return `${Math.floor(diff / 86400)}d ago`;
	}

	/** Calculates bar height percentage for sparkline visualization. */
	public getBarHeight(value: number): number {
		const max = this.sparkline_max();
		if (max === 0) return 0;
		return (value / max) * 100;
	}
}
