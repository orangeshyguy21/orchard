import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-index-section',
  standalone: false,
  templateUrl: './index-section.component.html',
  styleUrl: './index-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexSectionComponent {

}
