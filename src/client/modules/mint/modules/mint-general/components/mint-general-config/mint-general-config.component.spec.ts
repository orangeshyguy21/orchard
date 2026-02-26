import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintGeneralConfigComponent } from './mint-general-config.component';

describe('MintGeneralConfigComponent', () => {
  let component: MintGeneralConfigComponent;
  let fixture: ComponentFixture<MintGeneralConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintGeneralConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintGeneralConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
