/* Core Dependencies */
import {ChangeDetectionStrategy, Component, HostListener, WritableSignal, signal} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
/* Vendor Dependencies */
/* Application Dependencies */
import {EventData} from '@client/modules/event/classes/event-data.class';
/* Shared Dependencies */

@Component({
	selector: 'orc-index-subsection-app',
	standalone: false,
	templateUrl: './index-subsection-app.component.html',
	styleUrl: './index-subsection-app.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexSubsectionAppComponent {
	@HostListener('window:beforeunload')
	canDeactivate(): boolean {
		return this.active_event?.type !== 'PENDING';
	}

	public form_bitcoin: FormGroup = new FormGroup({
		enabled: new FormControl(false, [Validators.required]),
	});

	private active_event: EventData | null = null;

	private dirty_count: WritableSignal<number> = signal(0);
}
