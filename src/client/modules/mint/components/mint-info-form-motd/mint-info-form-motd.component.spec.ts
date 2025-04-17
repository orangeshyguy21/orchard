import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintInfoFormMotdComponent } from './mint-info-form-motd.component';

describe('MintInfoFormMotdComponent', () => {
  let component: MintInfoFormMotdComponent;
  let fixture: ComponentFixture<MintInfoFormMotdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintInfoFormMotdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintInfoFormMotdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
