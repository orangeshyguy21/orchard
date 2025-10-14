/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterOutlet} from '@angular/router';
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
		}).compileComponents();

		fixture = TestBed.createComponent(IndexSectionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
