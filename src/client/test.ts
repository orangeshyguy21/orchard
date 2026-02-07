import 'zone.js/testing';
import {getTestBed, TestBed} from '@angular/core/testing';
import {BrowserTestingModule, platformBrowserTesting} from '@angular/platform-browser/testing';

import {provideLuxonDateAdapter} from '@angular/material-luxon-adapter';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

// Set up global test config
(window as any).__config__ = {
	mode: {
		production: false,
		version: 'orchard/test',
	},
	api: {
		proxy: '',
		path: 'api',
	},
	bitcoin: {
		enabled: true,
	},
	lightning: {
		enabled: true,
	},
	taproot_assets: {
		enabled: false,
	},
	mint: {
		enabled: true,
		type: 'cdk',
		critical_path: '/v1/info',
		database_type: 'sqlite',
	},
	ai: {
		enabled: false,
	},
	constants: {
		taproot_group_keys: {
			usdt: '594ad28f56e02a3cbeef62166c92317fea911730392ea715ff756a398a8ffc4e',
		},
	},
};

// Initialize Angular testing environment
getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting(), {teardown: {destroyAfterEach: true}});

// Global providers for all specs
beforeEach(() => {
	TestBed.configureTestingModule({
		providers: [provideLuxonDateAdapter(), provideHttpClient(), provideHttpClientTesting()],
	});
});
