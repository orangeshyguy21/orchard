/* Core Dependencies */
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'orc-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AppComponent {}
