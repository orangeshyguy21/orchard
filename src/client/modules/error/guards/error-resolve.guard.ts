/* Core Dependencies */
import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
/* Application Dependencies */
import {ErrorService} from '@client/modules/error/services/error.service';

export const errorResolveGuard: CanActivateFn = () => {
	const router = inject(Router);
	const errorService = inject(ErrorService);
	if (errorService.resolve_errors.length === 0) {
		if (history.state.target) router.navigate([history.state.target]);
		return false;
	}
	return true;
};
