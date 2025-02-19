import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-primary-nav-items',
  standalone: false,
  templateUrl: './primary-nav-items.component.html',
  styleUrl: './primary-nav-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavItemsComponent {

}
