import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintInfoFormIconComponent } from './mint-info-form-icon.component';

describe('MintInfoFormIconComponent', () => {
  let component: MintInfoFormIconComponent;
  let fixture: ComponentFixture<MintInfoFormIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintInfoFormIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintInfoFormIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
