import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintSubsectionDisabledComponent } from './mint-subsection-disabled.component';

describe('MintSubsectionDisabledComponent', () => {
  let component: MintSubsectionDisabledComponent;
  let fixture: ComponentFixture<MintSubsectionDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintSubsectionDisabledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintSubsectionDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
