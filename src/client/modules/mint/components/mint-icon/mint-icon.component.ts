/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'orc-mint-icon',
    standalone: false,
    templateUrl: './mint-icon.component.html',
    styleUrl: './mint-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintIconComponent {

   @Input() icon_url!: string | null;

	constructor(
		private router: Router
	) { }

   	public onClick(){
		this.router.navigate(['mint', 'info']);
	}

}
