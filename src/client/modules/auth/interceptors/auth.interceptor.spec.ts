/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
/* Application Dependencies */
import {AuthService} from '@client/modules/auth/services/auth/auth.service';
/* Local Dependencies */
import {authInterceptor} from './auth.interceptor';

describe('authInterceptor', () => {
    let http: HttpClient;
    let httpTesting: HttpTestingController;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
                {provide: AuthService, useValue: authServiceSpy},
            ],
        });

        http = TestBed.inject(HttpClient);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should add Authorization header when auth headers exist', () => {
        authServiceSpy.getAuthHeaders.and.returnValue({Authorization: 'Bearer token123'});

        http.get('/api/test').subscribe();

        const req = httpTesting.expectOne('/api/test');
        expect(req.request.headers.get('Authorization')).toBe('Bearer token123');
        req.flush({});
    });

    it('should not modify request when no auth headers exist', () => {
        authServiceSpy.getAuthHeaders.and.returnValue({});

        http.get('/api/test').subscribe();

        const req = httpTesting.expectOne('/api/test');
        expect(req.request.headers.has('Authorization')).toBeFalse();
        req.flush({});
    });

    it('should not overwrite existing Authorization header', () => {
        authServiceSpy.getAuthHeaders.and.returnValue({Authorization: 'Bearer new-token'});

        http.get('/api/test', {headers: {Authorization: 'Bearer existing-token'}}).subscribe();

        const req = httpTesting.expectOne('/api/test');
        expect(req.request.headers.get('Authorization')).toBe('Bearer existing-token');
        req.flush({});
    });
});
