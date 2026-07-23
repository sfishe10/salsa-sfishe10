import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Evaluation} from "./evaluation.entity";
import {StationItem} from "./station-item.entity";

@Entity('EvaluationItem')
export class EvaluationItem {
    @PrimaryColumn({type: 'int'})
    evalId!: number;

    @PrimaryColumn({type: 'int'})
    itemId!: number;

    @ManyToOne(() => Evaluation, (evaluation: Evaluation) => evaluation.items, {
        onDelete: 'CASCADE',
        nullable: false})
    @JoinColumn({ name: 'evalId' })
    evaluation!: Evaluation;

    @ManyToOne(() => StationItem, (item: StationItem) => item.evalItems, {
        onDelete: 'CASCADE',
        nullable: false})
    @JoinColumn({ name: 'itemId' })
    stationItem!: StationItem;

    @Column({type: 'tinyint'})
    status!: boolean;
}