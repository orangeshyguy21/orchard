import 'zone.js/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {BrowserTestingModule, platformBrowserTesting} from '@angular/platform-browser/testing';

import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

// Initialize Angular testing environment
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {teardown: {destroyAfterEach: true}});

// Global providers for all specs
beforeEach(() => {
	TestBed.configureTestingModule({
		providers: [provideLuxonDateAdapter(), provideHttpClient(), provideHttpClientTesting()],
	});
});
