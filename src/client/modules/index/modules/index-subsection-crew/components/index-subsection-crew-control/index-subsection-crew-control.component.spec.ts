/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Native Dependencies */
import {OrcIndexSubsectionCrewModule} from '@client/modules/index/modules/index-subsection-crew/index-subsection-crew.module';
/* Local Dependencies */
import {IndexSubsectionCrewControlComponent} from './index-subsection-crew-control.component';

describe('IndexSubsectionCrewControlComponent', () => {
	let component: IndexSubsectionCrewControlComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionCrewModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewControlComponent);
		component = fixture.componentInstance;

		// Set required inputs
		fixture.componentRef.setInput(
			'form_group',
			new FormGroup({
				filter: new FormControl(''),
				state: new FormControl(''),
				role: new FormControl(''),
			}),
		);
		fixture.componentRef.setInput('state_options', []);
		fixture.componentRef.setInput('role_options', []);
		fixture.componentRef.setInput('filter_count', 0);
		fixture.componentRef.setInput('device_mobile', false);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
