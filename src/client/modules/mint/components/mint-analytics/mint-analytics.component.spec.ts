import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintAnalyticsComponent } from './mint-analytics.component';

describe('MintAnalyticsComponent', () => {
  let component: MintAnalyticsComponent;
  let fixture: ComponentFixture<MintAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
