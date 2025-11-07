import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { PepBand } from './pep-band.entity';
import { Section } from './section.entity';
import { Term } from './term.entity';
import { EventAttendance } from './event-attendance.entity';

@Entity('Member')
export class Member {
    @PrimaryGeneratedColumn()
    memberId!: number;

    @ManyToOne(() => User, (user: User) => user.members, { onDelete: 'CASCADE' })
    user!: User;

    @ManyToOne(() => PepBand, (pepBand: PepBand) => pepBand.members, { nullable: true })
    pepBand!: PepBand | null;

    @ManyToOne(() => Section, (section: Section) => section.members, { nullable: true })
    section!: Section | null;

    @ManyToOne(() => Term, (term: Term) => term.members, { onDelete: 'CASCADE' })
    term!: Term;

    @Column({ type: 'text', nullable: true })
    rehearsalConflict!: string | null;

    @OneToMany(() => EventAttendance, (ea) => ea.member)
    attendances!: EventAttendance[];

    @OneToMany(() => EventAttendance, (ea) => ea.sub)
    subs!: EventAttendance[];
}
