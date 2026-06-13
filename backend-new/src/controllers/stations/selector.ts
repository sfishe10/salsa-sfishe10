import {StationsService} from "../../services/stations.service";
import {Station} from "../../entities/station.entity";
import {toStationDto} from "../../mappers/station.mapper";
import {NotFoundError} from "../../errors/not-found-error";

const stationsService: StationsService = new StationsService();

/**
 * Stations selectors
 */

export const getAll = async (req: any, res: any) => {
    try {
        const stations: Station[] = await stationsService.getAll();

        res.send(stations);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};

export const getById = async (req: any, res: any) => {
    try {
        const stationId = req.params.id;

        const station: Station = await stationsService.getById(stationId);

        res.send(toStationDto(station));
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(404).send('Station not found');
        }

        console.error(err);
        res.status(500).send('Query failed');
    }
};
