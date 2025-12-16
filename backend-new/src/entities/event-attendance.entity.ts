import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    UpdateDateColumn,
} from 'typeorm';
import {MBEvent} from "./mb-event.entity";
import {Member} from "./member.entity";
import {Section} from "./section.entity";

@Entity('EventAttendance')
export class EventAttendance {
    @PrimaryGeneratedColumn()
    attendanceId!: number;

    // Each attendance belongs to one event
    @ManyToOne(() => MBEvent, (event: MBEvent) => event.attendances, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'eventId' })
    mbEvent!: MBEvent;

    // 'Present', 'Absent', 'Sub', etc.
    @Column({ type: 'varchar', length: 50, nullable: true })
    attendance!: string | null;

    @ManyToOne(() => Member, (member: Member) => member.attendances, { nullable: true })
    @JoinColumn({ name: 'memberId' })
    member!: Member | null;

    // Substitute member (optional)
    @ManyToOne(() => Member, { nullable: true })
    @JoinColumn({ name: 'subId' })
    sub!: Member | null;

    @Column({ type: 'boolean', default: false })
    required!: boolean;

    // Will auto-update whenever the record changes
    @UpdateDateColumn({ type: 'timestamp' })
    lastUpdated!: Date;

    // For when users add extra attendances - keeps the new attendance from showing up for other sections
    @ManyToOne(() => Section, { nullable: true })
    @JoinColumn({ name: 'sectionId' })
    section!: Section | null;
}

