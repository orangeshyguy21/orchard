/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcEcashGeneralModule} from '@client/modules/ecash/modules/ecash-general/ecash-general.module';
/* Local Dependencies */
import {EcashGeneralNoteComponent} from './ecash-general-note.component';

describe('EcashGeneralNoteComponent', () => {
	let component: EcashGeneralNoteComponent;
	let fixture: ComponentFixture<EcashGeneralNoteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcEcashGeneralModule],
		}).compileComponents();

		fixture = TestBed.createComponent(EcashGeneralNoteComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('amount', 256);
		fixture.componentRef.setInput('unit', 'sat');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
