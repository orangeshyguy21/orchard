import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewMemberChipComponent } from './crew-member-chip.component';

describe('CrewMemberChipComponent', () => {
  let component: CrewMemberChipComponent;
  let fixture: ComponentFixture<CrewMemberChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrewMemberChipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrewMemberChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
