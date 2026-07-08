import {Station} from "../entities/station.entity";
import {toStationGroupDto} from "./station-group.mapper";
import {plainToInstance} from "class-transformer";
import {StationDto} from "../dto/station.dto";

export function toStationDto(station: Station) {
    const plainObj = {
        stationId: station.stationId,
        title: station.title,
        description: station.description,
        maxFailed: station.maxFailed,
        level: station.level,
        class: station.class,

        groups: station.groups ?
            station.groups.map((group) => toStationGroupDto(group)) : null
    }

    return plainToInstance(StationDto, plainObj, { excludeExtraneousValues: true });
}