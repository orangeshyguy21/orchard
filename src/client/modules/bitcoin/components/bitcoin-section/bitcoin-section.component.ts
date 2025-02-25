import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-bitcoin-section',
  standalone: false,
  templateUrl: './bitcoin-section.component.html',
  styleUrl: './bitcoin-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BitcoinSectionComponent {

}
