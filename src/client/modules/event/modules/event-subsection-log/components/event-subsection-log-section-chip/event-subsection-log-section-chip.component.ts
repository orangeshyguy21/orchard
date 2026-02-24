/* Core Dependencies */
import {ChangeDetectionStrategy, Component, input, computed} from '@angular/core';
/* Shared Dependencies */
import {EventLogSection} from '@shared/generated.types';

@Component({
	selector: 'orc-event-subsection-log-section-chip',
	standalone: false,
	templateUrl: './event-subsection-log-section-chip.component.html',
	styleUrl: './event-subsection-log-section-chip.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSubsectionLogSectionChipComponent {
	public readonly section = input.required<EventLogSection>();
	public readonly icon_only = input<boolean>(false);

	public readonly icon_type = computed(() => {
		const section = this.section();
		if (section === EventLogSection.Bitcoin) return 'svg';
		return 'mat-icon';
	});

	public readonly icon = computed(() => {
		const section = this.section();
		if (section === EventLogSection.Ai) return 'spa';
		if (section === EventLogSection.Settings) return 'settings';
		if (section === EventLogSection.Mint) return 'account_balance';
		if (section === EventLogSection.Ecash) return 'payments';
		if (section === EventLogSection.Bitcoin) return 'bitcoin_outline';
		if (section === EventLogSection.Lightning) return 'bolt';
		return 'settings';
	});
}
