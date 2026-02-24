/* Core Dependencies */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
/* Shared Dependencies */
import { UserRole } from '@shared/generated.types';

@Component({
    selector: 'orc-crew-member-chip',
    standalone: false,
    templateUrl: './crew-member-chip.component.html',
    styleUrl: './crew-member-chip.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrewMemberChipComponent {
    public readonly name = input.required<string>();
    public readonly role = input.required<UserRole>();
    public readonly hide_role = input<boolean>(false);
}
