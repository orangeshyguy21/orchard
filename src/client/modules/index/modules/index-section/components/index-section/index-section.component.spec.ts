/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterOutlet, provideRouter} from '@angular/router';
/* Native Dependencies */
import {OrcIndexSectionModule} from '@client/modules/index/modules/index-section/index-section.module';
/* Local Dependencies */
import {IndexSectionComponent} from './index-section.component';

describe('IndexSectionComponent', () => {
	let component: IndexSectionComponent;
	let fixture: ComponentFixture<IndexSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcIndexSectionModule, RouterOutlet],
			declarations: [IndexSectionComponent],
			providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
