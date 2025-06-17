/* Core Dependencies */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
/* Application Configuration */
import { environment } from '@client/configs/configuration';

export const enabledGuard: CanActivateFn = (route, state) => {
	const section = route.data['section'];
	const router = inject(Router);
	console.log(section);
	switch (section) {
		case 'bitcoin':
			return true;
		case 'lightning':
			return environment.lightning.enabled;
		case 'mint':
			if (!environment.mint.enabled) {
				router.navigate(['/mint/disabled']);
				return false;
			}
			return true;
		default:
			return true;
	}
};
