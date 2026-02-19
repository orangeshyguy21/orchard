/* Vendor Dependencies */
import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
/* Local Dependencies */
import {ChangeDetailStatus} from './change.enums';
import {ChangeEvent} from './change-event.entity';

@Entity('change_details')
export class ChangeDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ChangeEvent, (event) => event.details, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'change_event_id'})
    change_event: ChangeEvent;

    @Column({type: 'text', length: 100})
    field: string;

    @Column({type: 'text', nullable: true})
    old_value: string | null;

    @Column({type: 'text', nullable: true})
    new_value: string | null;

    @Column({type: 'text', default: ChangeDetailStatus.SUCCESS})
    status: ChangeDetailStatus;

    @Column({type: 'text', nullable: true, length: 50})
    error_code: string | null;

    @Column({type: 'text', nullable: true, length: 500})
    error_message: string | null;
}
