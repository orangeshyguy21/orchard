/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
/* Application Dependencies */
import {User} from '@client/modules/crew/classes/user.class';
import {UserRole} from '@shared/generated.types';
/* Native Dependencies */
import {OrcIndexSubsectionCrewModule} from '@client/modules/index/modules/index-subsection-crew/index-subsection-crew.module';
/* Local Dependencies */
import {IndexSubsectionCrewDialogUserComponent} from './index-subsection-crew-dialog-user.component';

describe('IndexSubsectionCrewDialogUserComponent', () => {
	let component: IndexSubsectionCrewDialogUserComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewDialogUserComponent>;

	beforeEach(async () => {
		const mock_user = new User({
			id: 'test-user-id',
			name: 'Test User',
			role: UserRole.Reader,
			label: 'Test Label',
			active: true,
			created_at: Date.now(),
		});

		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionCrewModule],
			providers: [
				{
					provide: MatDialogRef,
					useValue: {
						close: jasmine.createSpy('close'),
					},
				},
				{
					provide: MAT_DIALOG_DATA,
					useValue: {user: mock_user},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewDialogUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
