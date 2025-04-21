import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintInfoFormUrlComponent } from './mint-info-form-url.component';

describe('MintInfoFormUrlComponent', () => {
  let component: MintInfoFormUrlComponent;
  let fixture: ComponentFixture<MintInfoFormUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintInfoFormUrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintInfoFormUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
