import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Station} from "./station.entity";

@Entity('StationPacket')
export class StationPacket {
    @PrimaryGeneratedColumn()
    packetId!: number;

    @ManyToOne(() => Station, (station) => station.packets, {
        onDelete: 'CASCADE',
        nullable: false})
    @JoinColumn({ name: 'stationId' })
    station!: Station;

    @Column({type: 'varchar', length: 40})
    title!: string;

    @Column({type: 'varchar', length: 20})
    role!: string;

    @Column({type: 'varchar', length: 20})
    info!: string;

    @Column({type: 'text'})
    content!: string;

    @Column({type: 'int'})
    level!: number;
}