import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'orc-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

}
