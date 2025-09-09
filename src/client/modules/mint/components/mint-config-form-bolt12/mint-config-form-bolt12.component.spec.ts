import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigFormBolt12Component } from './mint-config-form-bolt12.component';

describe('MintConfigFormBolt12Component', () => {
  let component: MintConfigFormBolt12Component;
  let fixture: ComponentFixture<MintConfigFormBolt12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigFormBolt12Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigFormBolt12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
