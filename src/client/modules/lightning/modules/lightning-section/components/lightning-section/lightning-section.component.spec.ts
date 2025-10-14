/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
/* Native Dependencies */
import {OrcLightningSectionModule} from '@client/modules/lightning/modules/lightning-section/lightning-section.module';
/* Local Dependencies */
import {LightningSectionComponent} from './lightning-section.component';

describe('LightningSectionComponent', () => {
	let component: LightningSectionComponent;
	let fixture: ComponentFixture<LightningSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcLightningSectionModule],
			providers: [provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(LightningSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
