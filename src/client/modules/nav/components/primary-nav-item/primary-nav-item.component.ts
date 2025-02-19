import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-primary-nav-item',
  standalone: false,
  templateUrl: './primary-nav-item.component.html',
  styleUrl: './primary-nav-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavItemComponent {

}
