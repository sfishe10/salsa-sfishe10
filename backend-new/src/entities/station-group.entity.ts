import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Station} from "./station.entity";
import {StationItem} from "./station-item.entity";

@Entity('StationGroup')
export class StationGroup {
    @PrimaryGeneratedColumn()
    groupId!: number;

    @ManyToOne(() => Station, (station: Station) => station.groups, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'stationId' })
    station!: Station;

    @Column({type: 'varchar', length: 60})
    title!: string;

    @Column({type: 'int'})
    level!: number;

    @OneToMany(() => StationItem, (item) => item.group)
    items!: StationItem[];
}