import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigFormQuoteTtlComponent } from './mint-config-form-quote-ttl.component';

describe('MintConfigFormQuoteTtlComponent', () => {
  let component: MintConfigFormQuoteTtlComponent;
  let fixture: ComponentFixture<MintConfigFormQuoteTtlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigFormQuoteTtlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigFormQuoteTtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
