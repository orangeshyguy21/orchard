import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-mint-data-table',
  standalone: false,
  templateUrl: './mint-data-table.component.html',
  styleUrl: './mint-data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintDataTableComponent {

}
