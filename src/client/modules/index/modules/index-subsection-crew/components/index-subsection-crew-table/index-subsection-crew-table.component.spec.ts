/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, FormControl} from '@angular/forms';
/* Vendor Dependencies */
import {MatTableDataSource} from '@angular/material/table';
/* Native Dependencies */
import {OrcIndexSubsectionCrewModule} from '@client/modules/index/modules/index-subsection-crew/index-subsection-crew.module';
/* Local Dependencies */
import {IndexSubsectionCrewTableComponent} from './index-subsection-crew-table.component';

describe('IndexSubsectionCrewTableComponent', () => {
	let component: IndexSubsectionCrewTableComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionCrewModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewTableComponent);
		component = fixture.componentInstance;

		// Set all required inputs
		fixture.componentRef.setInput('data', new MatTableDataSource([]));
		fixture.componentRef.setInput('data_length', 0);
		fixture.componentRef.setInput('id_user', null);
		fixture.componentRef.setInput('loading', false);
		fixture.componentRef.setInput(
			'form_invite',
			new FormGroup({
				label: new FormControl(''),
				role: new FormControl(''),
			}),
		);
		fixture.componentRef.setInput(
			'form_user',
			new FormGroup({
				label: new FormControl(''),
				role: new FormControl(''),
			}),
		);
		fixture.componentRef.setInput('role_options', []);
		fixture.componentRef.setInput('create_open', false);
		fixture.componentRef.setInput('table_form_id', null);
		fixture.componentRef.setInput('device_desktop', true);

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
