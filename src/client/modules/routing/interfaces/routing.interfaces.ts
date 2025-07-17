/* Vendor Dependencies */
import {Observable} from 'rxjs';

// export interface ComponentCanDeactivate {
// 	canDeactivate(): boolean | Observable<boolean>;
// }

export interface ComponentCanDeactivate {
	canDeactivate(): boolean;
}
