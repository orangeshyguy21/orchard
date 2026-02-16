import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintGeneralKeysetVersionComponent } from './mint-general-keyset-version.component';

describe('MintGeneralKeysetVersionComponent', () => {
  let component: MintGeneralKeysetVersionComponent;
  let fixture: ComponentFixture<MintGeneralKeysetVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintGeneralKeysetVersionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintGeneralKeysetVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
