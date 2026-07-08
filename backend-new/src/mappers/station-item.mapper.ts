import {StationItem} from "../entities/station-item.entity";
import {StationItemDto} from "../dto/station-item.dto";
import {toStationGroupDto} from "./station-group.mapper";
import {plainToInstance} from "class-transformer";

export function toStationItemDto(stationItem: StationItem): StationItemDto {
    const plainObj = {
        itemId: stationItem.itemId,
        item: stationItem.item,
        level: stationItem.level,
        required: stationItem.required,

        group: stationItem.group ? toStationGroupDto(stationItem.group) : null
    }

    return plainToInstance(StationItemDto, plainObj, { excludeExtraneousValues: true });
}