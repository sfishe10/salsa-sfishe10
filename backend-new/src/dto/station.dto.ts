import {Expose, Type} from "class-transformer";
import {StationGroupDto} from "./station-group.dto";
import {StationPacketDto} from "./station-packet.dto";

export class StationDto {
    @Expose()
    stationId!: number;

    @Expose()
    title!: string;

    @Expose()
    description!: string;

    @Expose()
    maxFailed!: number;

    @Expose()
    level!: number;

    @Expose()
    class!: number;

    @Expose()
    @Type(() => StationGroupDto)
    groups!: StationGroupDto[]

    @Expose()
    @Type(() => StationPacketDto)
    packets!: StationPacketDto[];
}