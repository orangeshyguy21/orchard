/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcIndexSubsectionCrewModule} from '@client/modules/index/modules/index-subsection-crew/index-subsection-crew.module';
/* Local Dependencies */
import {IndexSubsectionCrewFormInviteComponent} from './index-subsection-crew-form-invite.component';

describe('IndexSubsectionCrewFormInviteComponent', () => {
	let component: IndexSubsectionCrewFormInviteComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewFormInviteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionCrewModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewFormInviteComponent);
		component = fixture.componentInstance;

		// Set required inputs
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				label: new FormControl(''),
				role: new FormControl(''),
				expiration_enabled: new FormControl(false),
				expiration_date: new FormControl(''),
				expiration_time: new FormControl(0),
			}),
		);
		fixture.componentRef.setInput('open', false);
		fixture.componentRef.setInput('mode', 'create');
		fixture.componentRef.setInput('role_options', []);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
