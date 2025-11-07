import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Member } from './member.entity';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    userId!: number;

    @Column({ type: 'varchar', length: 255 })
    firstName!: string;

    @Column({ type: 'varchar', length: 255 })
    lastName!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 50 })
    role!: string;

    @OneToMany(() => Member, (member) => member.user)
    members!: Member[];
}
