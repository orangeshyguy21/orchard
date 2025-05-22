import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiModelComponent } from './ai-model.component';

describe('AiModelComponent', () => {
  let component: AiModelComponent;
  let fixture: ComponentFixture<AiModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
