/* Core Dependencies */
import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
/* Application Dependencies */
import {ConfigService} from '@client/modules/config/services/config.service';

export const enabledGuard: CanActivateFn = (route) => {
	const section = route.data['section'];
	const router = inject(Router);
	const configService = inject(ConfigService);

	switch (section) {
		case 'bitcoin':
			if (configService.config.bitcoin.enabled) return true;
			router.navigate(['/bitcoin/disabled']);
			return false;
		case 'lightning':
			if (configService.config.lightning.enabled) return true;
			router.navigate(['/lightning/disabled']);
			return false;
		case 'mint':
			if (configService.config.mint.enabled) return true;
			router.navigate(['/mint/disabled']);
			return false;
		default:
			return true;
	}
};
