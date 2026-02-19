/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
/* Native Dependencies */
import {OrcPublicModule} from '@client/modules/public/public.module';
/* Local Dependencies */
import {PublicExitWarningComponent} from './public-exit-warning.component';

describe('PublicExitWarningComponent', () => {
	let component: PublicExitWarningComponent;
	let fixture: ComponentFixture<PublicExitWarningComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcPublicModule],
			providers: [
				{provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}},
				{provide: MAT_DIALOG_DATA, useValue: {link: 'https://example.com'}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(PublicExitWarningComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
