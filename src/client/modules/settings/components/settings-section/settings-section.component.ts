import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-settings-section',
  standalone: false,
  templateUrl: './settings-section.component.html',
  styleUrl: './settings-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSectionComponent {

}
