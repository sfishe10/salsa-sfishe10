import {StationGroup} from "../entities/station-group.entity";
import {toStationDto} from "./station.mapper";
import {toStationItemDto} from "./station-item.mapper";
import {plainToInstance} from "class-transformer";
import {StationGroupDto} from "../dto/station-group.dto";

export function toStationGroupDto(stationGroup: StationGroup): StationGroupDto {
    const plainObj = {
        groupId: stationGroup.groupId,
        title: stationGroup.title,
        level: stationGroup.level,

        station: stationGroup.station ? toStationDto(stationGroup.station) : null,

        items: stationGroup.items ?
            stationGroup.items.map(item => toStationItemDto(item)) : null
    };

    return plainToInstance(StationGroupDto, plainObj, { excludeExtraneousValues: true });
}