import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MintSubsectionDatabaseDialogQuoteComponent} from './mint-subsection-database-dialog-quote.component';

describe('MintSubsectionDatabaseDialogQuoteComponent', () => {
	let component: MintSubsectionDatabaseDialogQuoteComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseDialogQuoteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionDatabaseDialogQuoteComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseDialogQuoteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
