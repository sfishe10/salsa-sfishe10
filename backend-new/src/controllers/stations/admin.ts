import {StationService} from "../../services/station.service";
import {StationDto} from "../../dto/station.dto";
import {plainToInstance} from "class-transformer";
import {Station} from "../../entities/station.entity";
import {toStationDto} from "../../mappers/station.mapper";
import {StationGroup} from "../../entities/station-group.entity";
import {toStationGroupDto} from "../../mappers/station-group.mapper";
import {StationItem} from "../../entities/station-item.entity";
import {toStationItemDto} from "../../mappers/station-item.mapper";

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

export const addGroup = async (req: any, res: any) => {
    try {
        const stationId: number = req.params.id;

        const group: StationGroup = await stationService.addGroup(stationId);

        res.send(toStationGroupDto(group));
    } catch (err: any) {
        console.error('A critical error occurred in stations.addGroup():', err.message);
        return res.status(500).send(err.message);
    }
};

export const addItem = async (req: any, res: any) => {
    try {
        const groupId: number = req.params.id;

        const item: StationItem = await stationService.addItem(groupId);

        res.send(toStationItemDto(item));
    } catch (err: any) {
        console.error('A critical error occurred in stations.addItem():', err.message);
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
