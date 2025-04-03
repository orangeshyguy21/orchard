/* Core Dependencies */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'orc-mint-name',
	standalone: false,
	templateUrl: './mint-name.component.html',
	styleUrl: './mint-name.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MintNameComponent {

	@Input() name!: string | null;
    @Input() loading!: boolean;
    @Input() error!: boolean;

    public get state(): 'loading' | 'error' | 'name' | 'unset' {
        if( this.loading ) return 'loading';
        if( this.error ) return 'error';
        if( this.name ) return 'name';
        return 'unset';
    }

	constructor(
		private router: Router
	) { }

   	public onClick(){
		this.router.navigate(['mint', 'info']);
	}

}
