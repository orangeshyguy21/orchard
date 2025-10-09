import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {RouterOutlet, provideRouter} from '@angular/router';
import {OrcNavModule} from '@client/modules/nav/nav.module';
import {IndexSectionComponent} from './index-section.component';

describe('IndexSectionComponent', () => {
	let component: IndexSectionComponent;
	let fixture: ComponentFixture<IndexSectionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [OrcNavModule, RouterOutlet],
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
