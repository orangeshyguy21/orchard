import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigFormEnabledComponent } from './mint-config-form-enabled.component';

describe('MintConfigFormEnabledComponent', () => {
  let component: MintConfigFormEnabledComponent;
  let fixture: ComponentFixture<MintConfigFormEnabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigFormEnabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigFormEnabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
