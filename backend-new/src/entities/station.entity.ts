import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {StationGroup} from "./station-group.entity";

@Entity('Station')
export class Station {
    @PrimaryGeneratedColumn()
    stationId!: number;

    @Column({type: 'varchar', length: 60})
    title!: string;

    @Column({type: 'varchar', length: 300})
    description!: string;

    @Column({type: 'int'})
    maxFailed!: number;

    @Column({type: 'int'})
    level!: number;

    @Column({type: 'int'})
    class!: number;

    @OneToMany(() => StationGroup, (group) => group.station, {
        cascade: true
    })
    groups!: StationGroup[];
}
