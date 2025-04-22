import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintSubsectionKeysetsComponent } from './mint-subsection-keysets.component';

describe('MintSubsectionKeysetsComponent', () => {
  let component: MintSubsectionKeysetsComponent;
  let fixture: ComponentFixture<MintSubsectionKeysetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintSubsectionKeysetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintSubsectionKeysetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
