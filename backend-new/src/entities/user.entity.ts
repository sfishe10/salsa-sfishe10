import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Member } from './member.entity';
import {Expose} from "class-transformer";
import {EventAttendance} from "./event-attendance.entity";
import {Evaluation} from "./evaluation.entity";

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

    @OneToMany(() => Evaluation, (evaluation) => evaluation.evaluator)
    evalsGiven!: Evaluation[];
}
