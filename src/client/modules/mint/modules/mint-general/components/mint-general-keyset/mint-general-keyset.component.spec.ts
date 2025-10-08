/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintGeneralKeysetComponent} from './mint-general-keyset.component';

describe('MintGeneralKeysetComponent', () => {
	let component: MintGeneralKeysetComponent;
	let fixture: ComponentFixture<MintGeneralKeysetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintGeneralKeysetComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintGeneralKeysetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
