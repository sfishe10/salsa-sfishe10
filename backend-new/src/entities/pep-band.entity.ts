import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { MBEvent } from './mb-event.entity';
import { Member } from './member.entity';

@Entity('PepBand')
export class PepBand {
    @PrimaryColumn({ type: 'varchar', length: 1 })
    bandId!: string;

    @Column({ type: 'varchar', length: 50 })
    displayName!: string;

    @OneToMany(() => MBEvent, (event) => event.pepBand)
    events!: MBEvent[];

    @OneToMany(() => Member, (member) => member.pepBand)
    members!: Member[];
}
