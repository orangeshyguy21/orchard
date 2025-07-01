/* Core Dependencies */
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, switchMap, throwError, map } from 'rxjs';
import { Router } from '@angular/router';
/* Application Dependencies */
import { AuthService } from '@client/modules/auth/services/auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (
	request: HttpRequest<unknown>,
	next: HttpHandlerFn
) => {

	const authService = inject(AuthService);
    const router = inject(Router);
	
	return next(request).pipe(
        map((response: any) => {
            if( !response.body?.errors ) return response;
            const has_auth_error = response.body.errors.some((err: any) => err.extensions?.code === 10002);
            const has_refresh_error = response.body.errors.some((err: any) => err.extensions?.code === 10003);
            if (has_refresh_error) throw { type: 'refresh_error', response };
            if (has_auth_error)  throw { type: 'auth_error', response };
            return response;
        }),
        catchError((error) => {
            if (error.type === 'refresh_error') {
                console.log('refresh error, logging out');
                authService.logout();
                router.navigate(['/authentication']);
            }

            if (error.type === 'auth_error') {
                return authService.refreshToken().pipe(
                    switchMap(() => {
                        const newHeaders = authService.getAuthHeaders();
                        const newRequest = request.clone({
                            setHeaders: newHeaders
                        });
                        return next(newRequest);
                    }),
                    catchError((refresh_error) => {
                        authService.logout();
                        console.log('refresh error, logging out', refresh_error );
                        router.navigate(['/authentication']);
                        return throwError(() => refresh_error);
                    })
                );
            }

            return throwError(() => error);
        })
	);
};