import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Section } from './section.entity';
import { MBEvent } from './mb-event.entity';

@Entity('VolunteerRosterMemberCount')
export class VolunteerRosterMemberCount {
    @PrimaryColumn({ type: 'int', name: 'sectionId' })
    sectionId!: number;

    @PrimaryColumn({ type: 'int', name: 'eventId' })
    eventId!: number;

    @ManyToOne(() => Section, { nullable: false })
    @JoinColumn({ name: 'sectionId' })
    section!: Section;

    @ManyToOne(() => MBEvent, { nullable: false })
    @JoinColumn({ name: 'eventId' })
    event!: MBEvent;

    @Column({ type: 'int', nullable: true })
    numMembersNeeded!: number | null;
}

