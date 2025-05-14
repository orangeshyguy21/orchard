import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintConfigFormNut17CommandsComponent } from './mint-config-form-nut17-commands.component';

describe('MintConfigFormNut17CommandsComponent', () => {
  let component: MintConfigFormNut17CommandsComponent;
  let fixture: ComponentFixture<MintConfigFormNut17CommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MintConfigFormNut17CommandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MintConfigFormNut17CommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
