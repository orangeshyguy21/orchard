import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightningChannelComponent } from './lightning-channel.component';

describe('LightningChannelComponent', () => {
  let component: LightningChannelComponent;
  let fixture: ComponentFixture<LightningChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LightningChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightningChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
