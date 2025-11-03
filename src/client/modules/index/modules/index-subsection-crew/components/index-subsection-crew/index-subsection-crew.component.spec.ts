/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcIndexSubsectionCrewModule} from '@client/modules/index/modules/index-subsection-crew/index-subsection-crew.module';
/* Local Dependencies */
import {IndexSubsectionCrewComponent} from './index-subsection-crew.component';

describe('IndexSubsectionCrewComponent', () => {
	let component: IndexSubsectionCrewComponent;
	let fixture: ComponentFixture<IndexSubsectionCrewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSubsectionCrewModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSubsectionCrewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
