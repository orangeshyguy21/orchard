/* Core Dependencies */
import {TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcAppModule} from '@client/app.module';
/* Local Dependencies */
import {AppComponent} from './app.component';

describe('AppComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcAppModule],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
