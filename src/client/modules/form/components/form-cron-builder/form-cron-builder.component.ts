/* Core Dependencies */
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

/** Data passed to the cron builder dialog */
export interface CronBuilderData {
	cron: string | null;
}

/** Tab index constants */
const TAB_HOURLY = 0;
const TAB_DAILY = 1;
const TAB_WEEKLY = 2;
const TAB_MONTHLY = 3;
const TAB_YEARLY = 4;

@Component({
	selector: 'orc-form-cron-builder',
	standalone: false,
	templateUrl: './form-cron-builder.component.html',
	styleUrl: './form-cron-builder.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCronBuilderComponent {
	/* ── Injected dependencies ── */
	private readonly dialog_ref = inject(MatDialogRef<FormCronBuilderComponent>);
	public readonly data: CronBuilderData = inject(MAT_DIALOG_DATA);

	/* ── Public signals ── */
	public readonly active_tab = signal<number>(TAB_HOURLY);

	/* Hourly */
	public readonly hourly_every = signal<number>(1);
	public readonly hourly_minute = signal<number>(0);

	/* Daily */
	public readonly daily_every = signal<number>(1);
	public readonly daily_hour = signal<number>(1);
	public readonly daily_minute = signal<number>(0);
	public readonly daily_period = signal<'AM' | 'PM'>('AM');

	/* Weekly */
	public readonly weekly_days = signal<boolean[]>([true, false, false, false, false, false, false]);
	public readonly weekly_hour = signal<number>(1);
	public readonly weekly_minute = signal<number>(0);
	public readonly weekly_period = signal<'AM' | 'PM'>('AM');

	/* Monthly */
	public readonly monthly_mode = signal<'day' | 'weekday'>('day');
	public readonly monthly_day = signal<number>(1);
	public readonly monthly_every = signal<number>(1);
	public readonly monthly_hour = signal<number>(9);
	public readonly monthly_minute = signal<number>(0);
	public readonly monthly_period = signal<'AM' | 'PM'>('AM');
	public readonly monthly_ordinal = signal<number>(1);
	public readonly monthly_weekday = signal<number>(1);
	public readonly monthly_weekday_hour = signal<number>(1);
	public readonly monthly_weekday_minute = signal<number>(0);
	public readonly monthly_weekday_period = signal<'AM' | 'PM'>('AM');

	/* Yearly */
	public readonly yearly_mode = signal<'day' | 'weekday'>('day');
	public readonly yearly_month = signal<number>(1);
	public readonly yearly_day = signal<number>(1);
	public readonly yearly_hour = signal<number>(1);
	public readonly yearly_minute = signal<number>(0);
	public readonly yearly_period = signal<'AM' | 'PM'>('AM');
	public readonly yearly_ordinal = signal<number>(1);
	public readonly yearly_weekday = signal<number>(1);
	public readonly yearly_weekday_month = signal<number>(1);
	public readonly yearly_weekday_hour = signal<number>(1);
	public readonly yearly_weekday_minute = signal<number>(0);
	public readonly yearly_weekday_period = signal<'AM' | 'PM'>('AM');

	/* ── Public computed signals ── */
	public readonly cron_expression = computed(() => this.buildCron());
	public readonly cron_preview = computed(() => this.buildPreview(this.cron_expression()));

	/* ── Public properties (dropdown options) ── */
	public readonly hour_options = this.buildRange(1, 12);
	public readonly minute_options = this.buildRange(0, 59).map((n) => ({value: n, label: String(n).padStart(2, '0')}));
	public readonly hourly_interval_options = this.buildRange(1, 24);
	public readonly daily_interval_options = this.buildRange(1, 31);
	public readonly monthly_interval_options = this.buildRange(1, 12);
	public readonly day_of_month_options = this.buildDayOfMonthOptions();
	public readonly month_options: {value: number; label: string}[] = [
		{value: 1, label: 'January'}, {value: 2, label: 'February'}, {value: 3, label: 'March'},
		{value: 4, label: 'April'}, {value: 5, label: 'May'}, {value: 6, label: 'June'},
		{value: 7, label: 'July'}, {value: 8, label: 'August'}, {value: 9, label: 'September'},
		{value: 10, label: 'October'}, {value: 11, label: 'November'}, {value: 12, label: 'December'},
	];
	public readonly weekday_options: {value: number; label: string}[] = [
		{value: 1, label: 'Monday'}, {value: 2, label: 'Tuesday'}, {value: 3, label: 'Wednesday'},
		{value: 4, label: 'Thursday'}, {value: 5, label: 'Friday'}, {value: 6, label: 'Saturday'},
		{value: 0, label: 'Sunday'},
	];
	public readonly ordinal_options: {value: number; label: string}[] = [
		{value: 1, label: 'First'}, {value: 2, label: 'Second'}, {value: 3, label: 'Third'},
		{value: 4, label: 'Fourth'}, {value: 5, label: 'Last'},
	];
	public readonly day_names: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	constructor() {
		if (this.data.cron) {
			this.parseCron(this.data.cron);
		}
	}

	/* *******************************************************
		Cron Generation
	******************************************************** */

	/** Builds a 5-field cron expression from the active tab's signals */
	private buildCron(): string {
		switch (this.active_tab()) {
			case TAB_HOURLY:
				return this.buildHourlyCron();
			case TAB_DAILY:
				return this.buildDailyCron();
			case TAB_WEEKLY:
				return this.buildWeeklyCron();
			case TAB_MONTHLY:
				return this.buildMonthlyCron();
			case TAB_YEARLY:
				return this.buildYearlyCron();
			default:
				return '* * * * *';
		}
	}

	private buildHourlyCron(): string {
		const minute = this.hourly_minute();
		const every = this.hourly_every();
		const hour_field = every === 1 ? '*' : `*/${every}`;
		return `${minute} ${hour_field} * * *`;
	}

	private buildDailyCron(): string {
		const minute = this.daily_minute();
		const hour = this.to24h(this.daily_hour(), this.daily_period());
		const every = this.daily_every();
		const dom_field = every === 1 ? '*' : `*/${every}`;
		return `${minute} ${hour} ${dom_field} * *`;
	}

	private buildWeeklyCron(): string {
		const minute = this.weekly_minute();
		const hour = this.to24h(this.weekly_hour(), this.weekly_period());
		const days = this.weekly_days();
		const cron_days: number[] = [];
		/* Map index 0-6 (Mon-Sun) to cron day_of_week (Mon=1..Sat=6, Sun=0) */
		const day_map = [1, 2, 3, 4, 5, 6, 0];
		days.forEach((selected, i) => {
			if (selected) cron_days.push(day_map[i]);
		});
		const dow_field = cron_days.length > 0 ? cron_days.join(',') : '*';
		return `${minute} ${hour} * * ${dow_field}`;
	}

	private buildMonthlyCron(): string {
		if (this.monthly_mode() === 'day') {
			const minute = this.monthly_minute();
			const hour = this.to24h(this.monthly_hour(), this.monthly_period());
			const day = this.monthly_day();
			const every = this.monthly_every();
			const month_field = every === 1 ? '*' : `*/${every}`;
			return `${minute} ${hour} ${day} ${month_field} *`;
		} else {
			const minute = this.monthly_weekday_minute();
			const hour = this.to24h(this.monthly_weekday_hour(), this.monthly_weekday_period());
			const ordinal = this.monthly_ordinal();
			const weekday = this.monthly_weekday();
			const every = this.monthly_every();
			const month_field = every === 1 ? '*' : `*/${every}`;
			const dow_field = ordinal === 5 ? `${weekday}L` : `${weekday}#${ordinal}`;
			return `${minute} ${hour} * ${month_field} ${dow_field}`;
		}
	}

	private buildYearlyCron(): string {
		if (this.yearly_mode() === 'day') {
			const minute = this.yearly_minute();
			const hour = this.to24h(this.yearly_hour(), this.yearly_period());
			const day = this.yearly_day();
			const month = this.yearly_month();
			return `${minute} ${hour} ${day} ${month} *`;
		} else {
			const minute = this.yearly_weekday_minute();
			const hour = this.to24h(this.yearly_weekday_hour(), this.yearly_weekday_period());
			const ordinal = this.yearly_ordinal();
			const weekday = this.yearly_weekday();
			const month = this.yearly_weekday_month();
			const dow_field = ordinal === 5 ? `${weekday}L` : `${weekday}#${ordinal}`;
			return `${minute} ${hour} * ${month} ${dow_field}`;
		}
	}

	/* *******************************************************
		Cron Parsing
	******************************************************** */

	/** Parses a 5-field cron expression and populates the correct tab signals */
	private parseCron(cron: string): void {
		const parts = cron.trim().split(/\s+/);
		if (parts.length !== 5) return;
		const [minute, hour, dom, month, dow] = parts;

		// Hourly: hour contains wildcard or step, dom/month/dow all wildcard
		if ((hour === '*' || hour.startsWith('*/')) && dom === '*' && month === '*' && dow === '*') {
			this.active_tab.set(TAB_HOURLY);
			this.hourly_minute.set(parseInt(minute, 10) || 0);
			this.hourly_every.set(hour === '*' ? 1 : parseInt(hour.slice(2), 10) || 1);
			return;
		}

		/* Weekly: dow is not * and doesn't contain # or L, dom is * */
		if (dow !== '*' && !dow.includes('#') && !dow.includes('L') && dom === '*' && (month === '*' || month.startsWith('*/'))) {
			if (month === '*') {
				this.active_tab.set(TAB_WEEKLY);
				const {hour: h12, period} = this.from24h(parseInt(hour, 10) || 0);
				this.weekly_hour.set(h12);
				this.weekly_minute.set(parseInt(minute, 10) || 0);
				this.weekly_period.set(period);
				const cron_days = dow.split(',').map((d) => parseInt(d, 10));
				const day_map: Record<number, number> = {1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6};
				const days = [false, false, false, false, false, false, false];
				cron_days.forEach((d) => {
					const idx = day_map[d];
					if (idx !== undefined) days[idx] = true;
				});
				this.weekly_days.set(days);
				return;
			}
		}

		/* Monthly or Yearly with weekday ordinal (# or L in dow) */
		if (dow !== '*' && (dow.includes('#') || dow.includes('L'))) {
			let weekday: number;
			let ordinal: number;
			if (dow.includes('#')) {
				const [wd, ord] = dow.split('#');
				weekday = parseInt(wd, 10);
				ordinal = parseInt(ord, 10);
			} else {
				weekday = parseInt(dow.replace('L', ''), 10);
				ordinal = 5;
			}

			if (month === '*' || month.startsWith('*/')) {
				/* Monthly weekday mode */
				this.active_tab.set(TAB_MONTHLY);
				this.monthly_mode.set('weekday');
				this.monthly_weekday.set(weekday);
				this.monthly_ordinal.set(ordinal);
				this.monthly_every.set(month === '*' ? 1 : parseInt(month.slice(2), 10) || 1);
				const {hour: h12, period} = this.from24h(parseInt(hour, 10) || 0);
				this.monthly_weekday_hour.set(h12);
				this.monthly_weekday_minute.set(parseInt(minute, 10) || 0);
				this.monthly_weekday_period.set(period);
			} else {
				/* Yearly weekday mode */
				this.active_tab.set(TAB_YEARLY);
				this.yearly_mode.set('weekday');
				this.yearly_weekday.set(weekday);
				this.yearly_ordinal.set(ordinal);
				this.yearly_weekday_month.set(parseInt(month, 10) || 1);
				const {hour: h12, period} = this.from24h(parseInt(hour, 10) || 0);
				this.yearly_weekday_hour.set(h12);
				this.yearly_weekday_minute.set(parseInt(minute, 10) || 0);
				this.yearly_weekday_period.set(period);
			}
			return;
		}

		// Yearly day mode: specific month (not wildcard or step) and specific dom
		if (dom !== '*' && !dom.startsWith('*/') && month !== '*' && !month.startsWith('*/') && dow === '*') {
			this.active_tab.set(TAB_YEARLY);
			this.yearly_mode.set('day');
			this.yearly_month.set(parseInt(month, 10) || 1);
			this.yearly_day.set(parseInt(dom, 10) || 1);
			const {hour: h12, period} = this.from24h(parseInt(hour, 10) || 0);
			this.yearly_hour.set(h12);
			this.yearly_minute.set(parseInt(minute, 10) || 0);
			this.yearly_period.set(period);
			return;
		}

		// Monthly day mode: specific dom with wildcard or step month
		if (dom !== '*' && !dom.startsWith('*/') && (month === '*' || month.startsWith('*/')) && dow === '*') {
			this.active_tab.set(TAB_MONTHLY);
			this.monthly_mode.set('day');
			this.monthly_day.set(parseInt(dom, 10) || 1);
			this.monthly_every.set(month === '*' ? 1 : parseInt(month.slice(2), 10) || 1);
			const {hour: h12, period} = this.from24h(parseInt(hour, 10) || 0);
			this.monthly_hour.set(h12);
			this.monthly_minute.set(parseInt(minute, 10) || 0);
			this.monthly_period.set(period);
			return;
		}

		// Daily fallback
		this.active_tab.set(TAB_DAILY);
		const {hour: h12, period} = this.from24h(parseInt(hour, 10) || 0);
		this.daily_hour.set(h12);
		this.daily_minute.set(parseInt(minute, 10) || 0);
		this.daily_period.set(period);
		this.daily_every.set(dom === '*' ? 1 : dom.startsWith('*/') ? parseInt(dom.slice(2), 10) || 1 : 1);
	}

	/* *******************************************************
		Preview
	******************************************************** */

	/** Generates a human-readable label from a cron expression */
	private buildPreview(cron: string): string {
		const parts = cron.trim().split(/\s+/);
		if (parts.length !== 5) return cron;
		const [minute, hour, dom, month, dow] = parts;

		const day_names: Record<string, string> = {
			'0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday',
			'4': 'Thursday', '5': 'Friday', '6': 'Saturday',
		};

		const month_names: Record<string, string> = {
			'1': 'January', '2': 'February', '3': 'March', '4': 'April',
			'5': 'May', '6': 'June', '7': 'July', '8': 'August',
			'9': 'September', '10': 'October', '11': 'November', '12': 'December',
		};

		/* Hourly */
		if ((hour === '*' || hour.startsWith('*/')) && dom === '*' && month === '*' && dow === '*') {
			const every = hour === '*' ? 1 : parseInt(hour.slice(2), 10);
			const min_label = String(parseInt(minute, 10)).padStart(2, '0');
			if (every === 1) return `Every hour at :${min_label}`;
			return `Every ${every} hours at :${min_label}`;
		}

		/* Weekly */
		if (dow !== '*' && !dow.includes('#') && !dow.includes('L') && dom === '*' && month === '*') {
			const days = dow.split(',').map((d) => day_names[d] ?? d).join(', ');
			const time = this.formatTime(parseInt(hour, 10), parseInt(minute, 10));
			return `Every ${days} at ${time}`;
		}

		/* Monthly/Yearly with ordinal weekday */
		if (dow !== '*' && (dow.includes('#') || dow.includes('L'))) {
			let weekday: string;
			let ordinal_label: string;
			if (dow.includes('#')) {
				const [wd, ord] = dow.split('#');
				weekday = day_names[wd] ?? wd;
				const ordinal_labels: Record<string, string> = {'1': 'first', '2': 'second', '3': 'third', '4': 'fourth', '5': 'last'};
				ordinal_label = ordinal_labels[ord] ?? ord;
			} else {
				weekday = day_names[dow.replace('L', '')] ?? dow;
				ordinal_label = 'last';
			}
			const time = this.formatTime(parseInt(hour, 10), parseInt(minute, 10));
			if (month !== '*' && !month.startsWith('*/')) {
				return `${ordinal_label} ${weekday} of ${month_names[month] ?? month} at ${time}`;
			}
			const every = month === '*' ? 1 : parseInt(month.slice(2), 10);
			return `${ordinal_label} ${weekday} every ${every === 1 ? '' : every + ' '}month${every === 1 ? '' : 's'} at ${time}`;
		}

		/* Yearly day mode */
		if (dom !== '*' && month !== '*' && !month.startsWith('*/') && dow === '*') {
			const time = this.formatTime(parseInt(hour, 10), parseInt(minute, 10));
			return `${month_names[month] ?? month} ${dom} at ${time}`;
		}

		/* Monthly day mode */
		if (dom !== '*' && (month === '*' || month.startsWith('*/')) && dow === '*') {
			const every = month === '*' ? 1 : parseInt(month.slice(2), 10);
			const time = this.formatTime(parseInt(hour, 10), parseInt(minute, 10));
			return `Day ${dom} every ${every === 1 ? '' : every + ' '}month${every === 1 ? '' : 's'} at ${time}`;
		}

		/* Daily */
		if (dom === '*' || dom.startsWith('*/')) {
			const every = dom === '*' ? 1 : parseInt(dom.slice(2), 10);
			const time = this.formatTime(parseInt(hour, 10), parseInt(minute, 10));
			if (every === 1) return `Daily at ${time}`;
			return `Every ${every} days at ${time}`;
		}

		return cron;
	}

	/* *******************************************************
		Actions
	******************************************************** */

	/** Saves the cron expression and closes the dialog */
	public onSave(): void {
		this.dialog_ref.close(this.cron_expression());
	}

	/** Closes the dialog without saving */
	public onCancel(): void {
		this.dialog_ref.close();
	}

	/** Toggles a weekly day checkbox */
	public onToggleDay(index: number): void {
		const days = [...this.weekly_days()];
		days[index] = !days[index];
		this.weekly_days.set(days);
	}

	/* *******************************************************
		Helpers
	******************************************************** */

	/** Converts 12-hour format to 24-hour */
	private to24h(hour: number, period: 'AM' | 'PM'): number {
		if (period === 'AM') return hour === 12 ? 0 : hour;
		return hour === 12 ? 12 : hour + 12;
	}

	/** Converts 24-hour format to 12-hour + AM/PM */
	private from24h(hour: number): {hour: number; period: 'AM' | 'PM'} {
		if (hour === 0) return {hour: 12, period: 'AM'};
		if (hour < 12) return {hour, period: 'AM'};
		if (hour === 12) return {hour: 12, period: 'PM'};
		return {hour: hour - 12, period: 'PM'};
	}

	/** Formats hour (24h) and minute into 12h time string */
	private formatTime(hour: number, minute: number): string {
		const {hour: h12, period} = this.from24h(hour);
		return `${h12}:${String(minute).padStart(2, '0')} ${period}`;
	}

	/** Builds an array of numbers from start to end */
	private buildRange(start: number, end: number): number[] {
		return Array.from({length: end - start + 1}, (_, i) => start + i);
	}

	/** Builds day-of-month options with ordinal suffixes */
	private buildDayOfMonthOptions(): {value: number; label: string}[] {
		return this.buildRange(1, 31).map((n) => {
			const suffix = this.getOrdinalSuffix(n);
			return {value: n, label: `${n}${suffix} Day`};
		});
	}

	/** Returns the ordinal suffix for a number */
	private getOrdinalSuffix(n: number): string {
		const remainder = n % 100;
		if (remainder >= 11 && remainder <= 13) return 'th';
		switch (n % 10) {
			case 1: return 'st';
			case 2: return 'nd';
			case 3: return 'rd';
			default: return 'th';
		}
	}
}
