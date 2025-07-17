import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryNavMoreComponent } from './secondary-nav-more.component';

describe('SecondaryNavMoreComponent', () => {
  let component: SecondaryNavMoreComponent;
  let fixture: ComponentFixture<SecondaryNavMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondaryNavMoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryNavMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
