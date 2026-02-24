/* Core Dependencies */
import {ComponentFixture, TestBed} from '@angular/core/testing';
/* Native Dependencies */
import {OrcCrewModule} from '@client/modules/crew/crew.module';
/* Local Dependencies */
import {CrewFacehashComponent} from './crew-facehash.component';

describe('CrewFacehashComponent', () => {
    let component: CrewFacehashComponent;
    let fixture: ComponentFixture<CrewFacehashComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrcCrewModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CrewFacehashComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('name', 'Alice');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
