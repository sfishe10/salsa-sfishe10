import {StationService} from "../../services/station.service";
import {StationDto} from "../../dto/station.dto";
import {plainToInstance} from "class-transformer";
import {Station} from "../../entities/station.entity";
import {toStationDto} from "../../mappers/station.mapper";
import {StationGroup} from "../../entities/station-group.entity";
import {toStationGroupDto} from "../../mappers/station-group.mapper";
import {StationItem} from "../../entities/station-item.entity";
import {toStationItemDto} from "../../mappers/station-item.mapper";
import {StationPacketDto} from "../../dto/station-packet.dto";
import {StationPacket} from "../../entities/station-packet.entity";
import {toStationPacketDto} from "../../mappers/station-packet.mapper";

const stationService: StationService = new StationService();

// TODO: fill these functions in for stations (I just copied them from the terms controller)
// export const create = async (req: any, res: any) => {
//     try {
//         const termDto: TermDto = plainToInstance(TermDto, req.body);
//
//         const savedTerm: Term = await termService.create(termDto);
//
//         res.send(toTermDto(savedTerm));
//     } catch (err: any) {
//         console.error('A critical error occurred in terms.create():', err.message);
//         return res.status(500).send(err.message);
//     }
// };

export const update = async (req: any, res: any) => {
    try {
        const stationDto: StationDto = plainToInstance(StationDto, req.body.station);

        const deleteGroupIds: number[] = req.body.deleteGroupIds;
        const deleteItemIds: number[] = req.body.deleteItemIds;

        const updatedStation: Station = await stationService.update(stationDto, deleteGroupIds, deleteItemIds);

        res.send(toStationDto(updatedStation));
    } catch (err: any) {
        console.error('A critical error occurred in stations.update():', err.message);
        return res.status(500).send(err.message);
    }
};

// export const deleteTerm = async (req: any, res: any) => {
//     try {
//         const termId = req.params.id;
//
//         await termService.delete(termId);
//
//         res.status(200).send(null);
//     } catch (err: any) {
//         console.error('A critical error occurred in terms.deleteTerm():', err.message);
//         return res.status(500).send(err.message);
//     }
// };

export const updatePacket = async (req: any, res: any) => {
    try {
        const packetDto: StationPacketDto = plainToInstance(StationPacketDto, req.body);

        const updatedPacket: StationPacket = await stationService.updatePacket(packetDto);

        res.send(toStationPacketDto(updatedPacket));
    } catch (err: any) {
        console.error('A critical error occurred in stations.updatePacket():', err.message);
        return res.status(500).send(err.message);
    }
};

export const deletePacket = async (req: any, res: any) => {
    try {
        const packetId = req.params.id;

        await stationService.deletePacket(packetId);

        res.status(200).send(null);
    } catch (err: any) {
        console.error('A critical error occurred in terms.deletePacket():', err.message);
        return res.status(500).send(err.message);
    }
};
