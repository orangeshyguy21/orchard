import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintInfoFormNameComponent } from './mint-info-form-name.component';

describe('MintInfoFormNameComponent', () => {
  let component: MintInfoFormNameComponent;
  let fixture: ComponentFixture<MintInfoFormNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintInfoFormNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintInfoFormNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
