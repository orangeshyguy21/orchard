import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigFormEnabledConfirmComponent } from './mint-config-form-enabled-confirm.component';

describe('MintConfigFormEnabledConfirmComponent', () => {
  let component: MintConfigFormEnabledConfirmComponent;
  let fixture: ComponentFixture<MintConfigFormEnabledConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigFormEnabledConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigFormEnabledConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
