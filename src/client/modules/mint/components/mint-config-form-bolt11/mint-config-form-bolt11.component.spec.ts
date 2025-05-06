import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigFormBolt11Component } from './mint-config-form-bolt11.component';

describe('MintConfigFormBolt11Component', () => {
  let component: MintConfigFormBolt11Component;
  let fixture: ComponentFixture<MintConfigFormBolt11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigFormBolt11Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigFormBolt11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
