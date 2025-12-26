import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Section } from './section.entity';
import { MBEvent } from './mb-event.entity';

@Entity('VolunteerRosterMemberCount')
export class VolunteerRosterMemberCount {
    @PrimaryColumn({ type: 'int', name: 'sectionId' })
    sectionId!: number;

    @PrimaryColumn({ type: 'int', name: 'eventId' })
    eventId!: number;

    // use eager loading here because Section only has a couple columns, and will always be needed when fetching VRMC's
    @ManyToOne(() => Section, { nullable: false, eager: true })
    @JoinColumn({ name: 'sectionId' })
    section!: Section;

    @ManyToOne(() => MBEvent, { nullable: false })
    @JoinColumn({ name: 'eventId' })
    mbEvent!: MBEvent;

    @Column({ type: 'int', nullable: true })
    numMembersNeeded!: number | null;
}

