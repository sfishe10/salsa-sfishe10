import {StationsRepository} from "../repositories/stations.repository";
import {Station} from "../entities/station.entity";

export class StationsService {
    private stationsRepository: StationsRepository;

    constructor(stationsRepository?: StationsRepository) {
        this.stationsRepository = stationsRepository ?? new StationsRepository();
    }

    public async getById(id: number): Promise<Station> {
        const station: Station = await this.stationsRepository.getStation(id);

        return station;
    }

    public async getAll(): Promise<Station[]> {
        return await this.stationsRepository.getAllStations();
    }
}