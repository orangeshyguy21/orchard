/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionCrewModule} from '@client/modules/index/modules/index-subsection-crew/index-subsection-crew.module';
import {Invite} from '@client/modules/crew/classes/invite.class';
import {UserRole} from '@shared/generated.types';
/* Local Dependencies */
import {IndexSubsectionCrewTableInviteComponent} from './index-subsection-crew-table-invite.component';

describe('IndexSubsectionCrewTableInviteComponent', () => {
	let component: IndexSubsectionCrewTableInviteComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewTableInviteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionCrewModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewTableInviteComponent);
		component = fixture.componentInstance;

		const mock_invite = new Invite({
			id: 'test-id',
			token: 'TEST12TOKEN4',
			label: 'Test Invite',
			role: UserRole.Reader,
			created_by_id: 'user1',
			claimed_by_id: null,
			used_at: null,
			expires_at: null,
			created_at: Date.now(),
		});

		fixture.componentRef.setInput('invite', mock_invite);
		fixture.componentRef.setInput('device_desktop', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
