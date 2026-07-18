import {StationPacket} from "../entities/station-packet.entity";
import {toStationDto} from "./station.mapper";
import {plainToInstance} from "class-transformer";
import {StationPacketDto} from "../dto/station-packet.dto";

export function toStationPacketDto(packet: StationPacket): StationPacketDto {
    const plainObj = {
        packetId: packet.packetId,
        title: packet.title,
        role: packet.role,
        info: packet.info,
        content: packet.content,

        station: packet.station ? toStationDto(packet.station) : null
    }

    return plainToInstance(StationPacketDto, plainObj, { excludeExtraneousValues: true });
}