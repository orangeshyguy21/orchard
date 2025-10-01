/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {IndexAppModule} from '@client/modules/index/index.app.module';
/* Local Dependencies */
import {IndexLightningEnabledComponent} from './index-lightning-enabled.component';

describe('IndexLightningEnabledComponent', () => {
	let component: IndexLightningEnabledComponent;
	let fixture: ComponentFixture<IndexLightningEnabledComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IndexAppModule],
		}).compileComponents();

		fixture = TestBed.createComponent(IndexLightningEnabledComponent);
		component = fixture.componentInstance;
		component.loading = false as any;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
