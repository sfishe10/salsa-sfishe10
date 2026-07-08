import {Expose, Type} from "class-transformer";
import {StationDto} from "./station.dto";
import {StationItemDto} from "./station-item.dto";

export class StationGroupDto {
    @Expose()
    groupId!: number;

    @Expose()
    @Type(() => StationDto)
    station!: StationDto;

    @Expose()
    title!: string;

    @Expose()
    level!: number;

    @Expose()
    @Type(() => StationItemDto)
    items!: StationItemDto[];
}