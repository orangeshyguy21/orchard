/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {ApiService} from './api.service';

describe('ApiService', () => {
	let service: ApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ApiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('exposes a graphql-ws client with subscribe/dispose', () => {
		expect(service.gql_client).toBeTruthy();
		expect(typeof service.gql_client.subscribe).toBe('function');
		expect(typeof service.gql_client.dispose).toBe('function');
	});
});
