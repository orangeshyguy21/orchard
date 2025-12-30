/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
/* Native Dependencies */
import {OrcMintSubsectionDatabaseModule} from '@client/modules/mint/modules/mint-subsection-database/mint-subsection-database.module';
/* Application Dependencies */
import {DataType} from '@client/modules/orchard/enums/data.enum';
import {MintSubsectionDatabaseDialogQuoteComponent} from './mint-subsection-database-dialog-quote.component';

describe('MintSubsectionDatabaseDialogQuoteComponent', () => {
	let component: MintSubsectionDatabaseDialogQuoteComponent;
	let fixture: ComponentFixture<MintSubsectionDatabaseDialogQuoteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcMintSubsectionDatabaseModule],
			providers: [
				{provide: MatDialogRef, useValue: {close: jasmine.createSpy('close')}},
				{provide: MAT_DIALOG_DATA, useValue: {quote: {}, type: DataType.MintMints}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionDatabaseDialogQuoteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
