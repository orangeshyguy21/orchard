import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'orc-primary-nav-header',
  standalone: false,
  templateUrl: './primary-nav-header.component.html',
  styleUrl: './primary-nav-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrimaryNavHeaderComponent {
  
  @Input() active_section: string = '';

}
