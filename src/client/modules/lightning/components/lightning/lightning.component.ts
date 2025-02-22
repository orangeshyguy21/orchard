import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-lightning',
  standalone: false,
  templateUrl: './lightning.component.html',
  styleUrl: './lightning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LightningComponent {

}
