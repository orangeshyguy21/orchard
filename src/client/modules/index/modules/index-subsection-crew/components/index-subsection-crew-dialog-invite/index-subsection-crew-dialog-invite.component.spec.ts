/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Vendor Dependencies */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
/* Application Dependencies */
import {Invite} from '@client/modules/crew/classes/invite.class';
import {UserRole} from '@shared/generated.types';
/* Native Dependencies */
import {OrcIndexSubsectionCrewModule} from '@client/modules/index/modules/index-subsection-crew/index-subsection-crew.module';
/* Local Dependencies */
import {IndexSubsectionCrewDialogInviteComponent} from './index-subsection-crew-dialog-invite.component';

describe('IndexSubsectionCrewDialogInviteComponent', () => {
	let component: IndexSubsectionCrewDialogInviteComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewDialogInviteComponent>;

	beforeEach(async () => {
		const mock_invite = new Invite({
			id: 'test-invite-id',
			token: 'TEST12TOKEN4',
			label: 'Test Invite',
			role: UserRole.Reader,
			created_by_id: 'user1',
			claimed_by_id: null,
			used_at: null,
			expires_at: null,
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
					useValue: {invite: mock_invite},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewDialogInviteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
