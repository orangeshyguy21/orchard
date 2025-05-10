import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigFormMinComponent } from './mint-config-form-min.component';

describe('MintConfigFormMinComponent', () => {
  let component: MintConfigFormMinComponent;
  let fixture: ComponentFixture<MintConfigFormMinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigFormMinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigFormMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
