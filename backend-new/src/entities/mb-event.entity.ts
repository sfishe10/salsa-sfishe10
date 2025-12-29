import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import { PepBand } from './pep-band.entity';
import { Term } from './term.entity';
import { EventAttendance } from './event-attendance.entity';
import {VolunteerRosterMemberCount} from "./volunteer-roster-member-count.entity";

@Entity('MBEvent')
export class MBEvent {
    @PrimaryGeneratedColumn()
    eventId!: number;

    @Column({ type: 'varchar', length: 50 })
    type!: string;

    @Column({ type: 'varchar', length: 50 })
    title!: string;

    @Column({ type: 'datetime' })
    date!: Date;

    @ManyToOne(() => PepBand, (pepBand: PepBand) => pepBand.events, { nullable: true })
    @JoinColumn({ name: 'pepBandId' })
    pepBand!: PepBand | null;

    @Column({ type: 'boolean', default: false })
    extraAttendeesAllowed!: boolean;

    @ManyToOne(() => Term, (term: Term) => term.events, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'termId' })
    term!: Term;

    @OneToMany(() => EventAttendance, (ea) => ea.mbEvent)
    attendances!: EventAttendance[];

    @OneToMany(() => VolunteerRosterMemberCount, (count) => count.mbEvent)
    volunteerRosterMemberCounts!: VolunteerRosterMemberCount[];
}
