import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintSectionComponent } from './mint-section.component';

describe('MintSectionComponent', () => {
  let component: MintSectionComponent;
  let fixture: ComponentFixture<MintSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
