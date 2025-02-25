import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-lightning-section',
  standalone: false,
  templateUrl: './lightning-section.component.html',
  styleUrl: './lightning-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightningSectionComponent {

}
