/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcCrewModule} from '@client/modules/crew/crew.module';
/* Local Dependencies */
import {CrewUserIconComponent} from './crew-user-icon.component';

describe('CrewUserIconComponent', () => {
	let component: CrewUserIconComponent;
	let fixture: ComponentFixture<CrewUserIconComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcCrewModule],
		}).compileComponents();

		fixture = TestBed.createComponent(CrewUserIconComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('is_self', false);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
