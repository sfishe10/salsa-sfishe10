import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { MBEvent } from './mb-event.entity';
import { Member } from './member.entity';

@Entity('PepBand')
export class PepBand {
    @PrimaryColumn({ type: 'varchar', length: 10 })
    bandId!: string;

    @Column({ type: 'varchar', length: 255 })
    displayName!: string;

    @OneToMany(() => MBEvent, (event) => event.pepBand)
    events!: MBEvent[];

    @OneToMany(() => Member, (member) => member.pepBand)
    members!: Member[];
}
