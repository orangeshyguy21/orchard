/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcCrewModule} from '@client/modules/crew/crew.module';
/* Shared Dependencies */
import {UserRole} from '@shared/generated.types';
/* Local Dependencies */
import {CrewMemberChipComponent} from './crew-member-chip.component';

describe('CrewMemberChipComponent', () => {
    let component: CrewMemberChipComponent;
    let fixture: ComponentFixture<CrewMemberChipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrcCrewModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CrewMemberChipComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('name', 'Alice');
        fixture.componentRef.setInput('role', UserRole.Admin);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
