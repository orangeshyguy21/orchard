import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigFormDisabledComponent } from './mint-config-form-disabled.component';

describe('MintConfigFormDisabledComponent', () => {
  let component: MintConfigFormDisabledComponent;
  let fixture: ComponentFixture<MintConfigFormDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigFormDisabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigFormDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
