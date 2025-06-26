/* Core Dependencies */
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
/* Application Dependencies */
import { AuthService } from '@client/modules/auth/services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (
	request: HttpRequest<unknown>,
	next: HttpHandlerFn
) => {
	const authService = inject(AuthService);
	const authHeaders = authService.getAuthHeaders();
	if (Object.keys(authHeaders).length > 0) {
		request = request.clone({
			setHeaders: authHeaders
		});
	}
	return next(request);
};