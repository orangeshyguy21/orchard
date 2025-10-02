/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSDConnectionStatusComponent} from './mint-sd-connection-status.component';

describe('MintSDConnectionStatusComponent', () => {
	let component: MintSDConnectionStatusComponent;
	let fixture: ComponentFixture<MintSDConnectionStatusComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSDConnectionStatusComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSDConnectionStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
