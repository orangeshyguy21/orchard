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
    @Input() loading!: boolean;
    @Input() error!: boolean;

    public get state(): 'loading' | 'error' | 'icon' | 'unset' {
        if( this.loading ) return 'loading';
        if( this.error ) return 'error';
        if( this.icon_url ) return 'icon';
        return 'unset';
    }

	constructor(
		private router: Router
	) { }

   	public onClick(){
		this.router.navigate(['mint', 'info']);
	}

}
