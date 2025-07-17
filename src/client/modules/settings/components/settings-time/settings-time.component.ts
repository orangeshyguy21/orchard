/* Core Dependencies */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
/* Application Dependencies */
import {Locale, Timezone} from '@client/modules/cache/services/local-storage/local-storage.types';

@Component({
	selector: 'orc-settings-time',
	standalone: false,
	templateUrl: './settings-time.component.html',
	styleUrl: './settings-time.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTimeComponent {
	@Input() locale!: Locale | null;
	@Input() timezone!: Timezone | null;
	@Input() loading!: boolean;

	@Output() localeChange = new EventEmitter<string | null>();
	@Output() timezoneChange = new EventEmitter<string | null>();
}
