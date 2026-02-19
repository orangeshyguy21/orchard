/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
/* Local Dependencies */
import {ChangeActorType, ChangeSection, ChangeAction, ChangeStatus} from './change.enums';
import {ChangeDetail} from './change-detail.entity';

@Entity('change_events')
export class ChangeEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text'})
    actor_type: ChangeActorType;

    @Column({type: 'text', length: 100})
    actor_id: string;

    @Column({type: 'integer'})
    timestamp: number;

    @Column({type: 'text'})
    section: ChangeSection;

    @Column({type: 'text', nullable: true, length: 100})
    section_id: string | null;

    @Column({type: 'text', length: 100})
    entity_type: string;

    @Column({type: 'text', length: 100})
    entity_id: string;

    @Column({type: 'text'})
    action: ChangeAction;

    @Column({type: 'text', default: ChangeStatus.SUCCESS})
    status: ChangeStatus;

    @OneToMany(() => ChangeDetail, (detail) => detail.change_event, {cascade: true})
    details: ChangeDetail[];
}
