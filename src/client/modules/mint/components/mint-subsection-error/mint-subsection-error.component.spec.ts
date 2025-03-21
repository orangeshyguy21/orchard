import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintSubsectionErrorComponent } from './mint-subsection-error.component';

describe('MintSubsectionErrorComponent', () => {
  let component: MintSubsectionErrorComponent;
  let fixture: ComponentFixture<MintSubsectionErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintSubsectionErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintSubsectionErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
