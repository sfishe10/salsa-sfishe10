import {Expose, Type} from "class-transformer";
import {StationGroupDto} from "./station-group.dto";

export class StationItemDto {
    @Expose()
    itemId!: number;

    @Expose()
    @Type(() => StationGroupDto)
    group!: StationGroupDto;

    @Expose()
    item!: string;

    @Expose()
    level!: number;

    @Expose()
    required!: boolean;
}