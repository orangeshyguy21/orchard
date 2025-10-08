/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSubsectionKeysetsChartComponent} from './mint-subsection-keysets-chart.component';

describe('MintSubsectionKeysetsChartComponent', () => {
	let component: MintSubsectionKeysetsChartComponent;
	let fixture: ComponentFixture<MintSubsectionKeysetsChartComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSubsectionKeysetsChartComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSubsectionKeysetsChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
