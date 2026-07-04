import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {StationGroup} from "./station-group.entity";

@Entity('StationItem')
export class StationItem {
    @PrimaryGeneratedColumn()
    itemId!: number;

    @ManyToOne(() => StationGroup, (group) => group.items, {
        onDelete: 'CASCADE',
        nullable: false})
    @JoinColumn({ name: 'groupId' })
    group!: StationGroup;

    @Column({type: 'varchar', length: 90})
    item!: string;

    @Column({type: 'int'})
    level!: number;

    @Column({type: 'tinyint'})
    required!: boolean;
}