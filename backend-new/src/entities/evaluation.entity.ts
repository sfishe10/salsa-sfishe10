import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Station} from "./station.entity";
import {Member} from "./member.entity";
import {EvaluationItem} from "./evaluation-item.entity";

@Entity('Evaluation')
export class Evaluation {
    @PrimaryGeneratedColumn()
    evalId!: number;

    @ManyToOne(() => Member, (member: Member) => member.evalsReceived, {
        onDelete: 'CASCADE',
        nullable: false})
    @JoinColumn({ name: 'memberId' })
    member!: Member;

    @ManyToOne(() => Member, (member: Member) => member.evalsGiven, {
        onDelete: 'CASCADE',
        nullable: false})
    @JoinColumn({ name: 'memberId' })
    evaluator!: Member;

    @ManyToOne(() => Station, (station: Station) => station.evaluations, {
        onDelete: 'CASCADE',
        nullable: false})
    @JoinColumn({ name: 'stationId' })
    station!: Station;

    @Column({type: 'tinyint', nullable: true})
    passed!: boolean | null;

    @Column({type: 'datetime'})
    evalTime!: Date;

    @OneToMany(() => EvaluationItem, (item) => item.evaluation, {cascade: true})
    items!: EvaluationItem[];
}