/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Local Dependencies */
import {MintSDConnectionQrcodeDialogComponent} from './mint-sd-connection-qrcode-dialog.component';

describe('MintSDConnectionQrcodeDialogComponent', () => {
	let component: MintSDConnectionQrcodeDialogComponent;
	let fixture: ComponentFixture<MintSDConnectionQrcodeDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MintSDConnectionQrcodeDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MintSDConnectionQrcodeDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
