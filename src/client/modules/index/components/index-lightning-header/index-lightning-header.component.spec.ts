/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {IndexLightningHeaderComponent} from './index-lightning-header.component';

describe('IndexLightningHeaderComponent', () => {
	let component: IndexLightningHeaderComponent;
	let fixture: ComponentFixture<IndexLightningHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IndexLightningHeaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexLightningHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
