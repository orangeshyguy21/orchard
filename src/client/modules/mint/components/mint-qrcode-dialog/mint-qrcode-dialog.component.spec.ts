import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintQrcodeDialogComponent } from './mint-qrcode-dialog.component';

describe('MintQrcodeDialogComponent', () => {
  let component: MintQrcodeDialogComponent;
  let fixture: ComponentFixture<MintQrcodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintQrcodeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintQrcodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
