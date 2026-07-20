import {Expose, Type} from "class-transformer";
import {StationDto} from "./station.dto";

export class StationPacketDto {
    @Expose()
    packetId!: number;

    @Expose()
    @Type(() => StationDto)
    station!: StationDto

    @Expose()
    title!: string;

    @Expose()
    role!: string;

    @Expose()
    info!: string;

    @Expose()
    content!: string;

    @Expose()
    level!: number;
}