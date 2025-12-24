import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import { User } from './user.entity';
import { PepBand } from './pep-band.entity';
import { Section } from './section.entity';
import { Term } from './term.entity';
import { EventAttendance } from './event-attendance.entity';
import {Expose} from "class-transformer";

@Entity('Member')
export class Member {
    @PrimaryGeneratedColumn()
    memberId!: number;

    @ManyToOne(() => User, (user: User) => user.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'email', referencedColumnName: 'email', })
    user!: User;

    @ManyToOne(() => PepBand, (pepBand: PepBand) => pepBand.members, { nullable: true })
    @JoinColumn({ name: 'pepBandId' })
    pepBand!: PepBand | null;

    @ManyToOne(() => Section, (section: Section) => section.members, { nullable: true })
    @JoinColumn({ name: 'sectionId' })
    section!: Section | null;

    @ManyToOne(() => Term, (term: Term) => term.members, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'termId' })
    term!: Term;

    @Column({ type: 'text', nullable: true })
    rehearsalConflict!: string | null;

    @OneToMany(() => EventAttendance, (ea) => ea.member)
    attendances!: EventAttendance[];

    @OneToMany(() => EventAttendance, (ea) => ea.sub)
    subs!: EventAttendance[];

    @Expose()
    get allAttendances(): EventAttendance[] {
        const combined = [...(this.attendances || []), ...(this.subs || [])];

        combined.sort((a, b) => {
            const dateA = a.mbEvent?.date ? new Date(a.mbEvent.date).getTime() : 0;
            const dateB = b.mbEvent?.date ? new Date(b.mbEvent.date).getTime() : 0;
            return dateB - dateA;
        });

        return combined;
    }
}
