/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Application Dependencies */
import {User} from '@client/modules/crew/classes/user.class';
/* Native Dependencies */
import {OrcIndexSubsectionCrewModule} from '@client/modules/index/modules/index-subsection-crew/index-subsection-crew.module';
/* Shared Dependencies */
import {UserRole} from '@shared/generated.types';
/* Local Dependencies */
import {IndexSubsectionCrewTableUserComponent} from './index-subsection-crew-table-user.component';

describe('IndexSubsectionCrewTableUserComponent', () => {
	let component: IndexSubsectionCrewTableUserComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewTableUserComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionCrewModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewTableUserComponent);
		component = fixture.componentInstance;

		const mock_user = new User({
			id: '1',
			name: 'TestUser',
			role: UserRole.Admin,
			active: true,
			created_at: Date.now() / 1000,
		});

		fixture.componentRef.setInput('user', mock_user);
		fixture.componentRef.setInput('is_self', false);
		fixture.componentRef.setInput('is_admin', true);
		fixture.componentRef.setInput('device_desktop', true);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
