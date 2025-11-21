/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcProgressModule} from '@client/modules/progress/progress.module';
/* Local Dependencies */
import {ProgressCircleComponent} from './progress-circle.component';

describe('ProgressCircleComponent', () => {
	let component: ProgressCircleComponent;
	let fixture: ComponentFixture<ProgressCircleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcProgressModule],
		}).compileComponents();

		fixture = TestBed.createComponent(ProgressCircleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
