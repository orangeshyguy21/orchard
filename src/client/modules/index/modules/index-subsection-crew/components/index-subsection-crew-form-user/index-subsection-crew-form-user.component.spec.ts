/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcIndexSubsectionCrewModule} from '@client/modules/index/modules/index-subsection-crew/index-subsection-crew.module';
/* Local Dependencies */
import {IndexSubsectionCrewFormUserComponent} from './index-subsection-crew-form-user.component';

describe('IndexSubsectionCrewFormUserComponent', () => {
	let component: IndexSubsectionCrewFormUserComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewFormUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionCrewModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewFormUserComponent);
		component = fixture.componentInstance;

		// Set required inputs
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				label: new FormControl(''),
				role: new FormControl(''),
				active: new FormControl(true),
			}),
		);
		fixture.componentRef.setInput('id_entity', null);
		fixture.componentRef.setInput('role_options', []);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
