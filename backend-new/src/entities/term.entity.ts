import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MBEvent } from './mb-event.entity';
import { Member } from './member.entity';

@Entity('Term')
export class Term {
    @PrimaryGeneratedColumn()
    termId!: number;

    @Column({ type: 'varchar', length: 100 })
    termName!: string;

    @Column({ type: 'datetime' })
    startDate!: Date;

    @Column({ type: 'datetime' })
    endDate!: Date;

    @OneToMany(() => MBEvent, (event) => event.term)
    events!: MBEvent[];

    @OneToMany(() => Member, (member) => member.term)
    members!: Member[];
}
