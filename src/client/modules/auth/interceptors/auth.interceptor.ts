/* Core Dependencies */
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
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
	
	return next(request).pipe(
		catchError((error: HttpErrorResponse) => {
			if (error.status === 401) {
				return authService.refreshToken().pipe(
					switchMap(() => {
						const newHeaders = authService.getAuthHeaders();
						const newRequest = request.clone({
							setHeaders: newHeaders
						});
						return next(newRequest);
					}),
					catchError((refreshError) => {
						authService.logout();
						return throwError(() => refreshError);
					})
				);
			}
			return throwError(() => error);
		})
	);
};