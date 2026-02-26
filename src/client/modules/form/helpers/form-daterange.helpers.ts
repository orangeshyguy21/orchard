/* Vendor Dependencies */
import {DateTime} from 'luxon';
/* Application Dependencies */
import {DateRangePreset} from '@client/modules/form/types/form-daterange.types';

/** Resolves a preset to unix-second timestamps for date_start and date_end */
export function resolveDateRangePreset(
	preset: DateRangePreset,
	genesis_time: number = 0,
	now: DateTime = DateTime.now(),
): {date_start: number; date_end: number} {
	const end_of_today = Math.floor(now.endOf('day').toSeconds());
	switch (preset) {
		case DateRangePreset.Last7Days:
			return {date_start: Math.floor(now.minus({days: 7}).startOf('day').toSeconds()), date_end: end_of_today};
		case DateRangePreset.Last30Days:
			return {date_start: Math.floor(now.minus({days: 30}).startOf('day').toSeconds()), date_end: end_of_today};
		case DateRangePreset.Last90Days:
			return {date_start: Math.floor(now.minus({days: 90}).startOf('day').toSeconds()), date_end: end_of_today};
		case DateRangePreset.ThisQuarter:
			return {date_start: Math.floor(now.startOf('quarter').toSeconds()), date_end: end_of_today};
		case DateRangePreset.ThisYear:
			return {date_start: Math.floor(now.startOf('year').toSeconds()), date_end: end_of_today};
		case DateRangePreset.LastYear: {
			const last_year = now.minus({years: 1});
			return {
				date_start: Math.floor(last_year.startOf('year').toSeconds()),
				date_end: Math.floor(last_year.endOf('year').toSeconds()),
			};
		}
		case DateRangePreset.AllTime:
			return {date_start: genesis_time, date_end: end_of_today};
	}
}
