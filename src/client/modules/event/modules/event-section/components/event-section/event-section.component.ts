/* Core Dependencies */
import {ChangeDetectionStrategy, Component, signal, inject} from '@angular/core';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';

@Component({
	selector: 'orc-event-section',
	standalone: false,
	templateUrl: './event-section.component.html',
	styleUrl: './event-section.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSectionComponent {
    private readonly configService = inject(ConfigService);
    
    public readonly version = signal<string>(this.configService.config.mode.version);

}
