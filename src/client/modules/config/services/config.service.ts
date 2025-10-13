/* Core Dependencies */
import {Injectable} from '@angular/core';
/* Native Dependencies */
import {Config} from '@client/modules/config/types/config';

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	public config: Config;

	constructor() {
		this.config = (window as any).__config__;
	}
}
