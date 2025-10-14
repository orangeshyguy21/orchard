/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintGeneralNameComponent} from './mint-general-name.component';

describe('MintGeneralNameComponent', () => {
	let component: MintGeneralNameComponent;
	let fixture: ComponentFixture<MintGeneralNameComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintGeneralNameComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralNameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
