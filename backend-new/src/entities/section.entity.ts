import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Member } from './member.entity';

@Entity('Section')
export class Section {
    @PrimaryGeneratedColumn()
    sectionId!: number;

    @Column({ type: 'varchar', length: 100 })
    name!: string;

    @OneToMany(() => Member, (member) => member.section)
    members!: Member[];
}
