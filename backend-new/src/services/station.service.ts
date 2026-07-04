import {StationGroupRepository, StationItemRepository, StationRepository} from "../repositories/station.repository";
import {Station} from "../entities/station.entity";
import {StationDto} from "../dto/station.dto";
import {StationGroup} from "../entities/station-group.entity";
import {StationItem} from "../entities/station-item.entity";

export class StationService {
    private stationRepository: StationRepository;
    private stationGroupRepository: StationGroupRepository;
    private stationItemRepository: StationItemRepository;

    constructor(stationsRepository?: StationRepository,
                stationGroupRepository?: StationGroupRepository,
                stationItemRepository?: StationItemRepository) {
        this.stationRepository = stationsRepository ?? new StationRepository();
        this.stationGroupRepository = stationGroupRepository ?? new StationGroupRepository();
        this.stationItemRepository = stationItemRepository ?? new StationItemRepository();
    }

    public async getById(id: number): Promise<Station> {
        const station: Station = await this.stationRepository.getStation(id);

        return station;
    }

    public async getAll(): Promise<Station[]> {
        return await this.stationRepository.getAllStations();
    }

    public async update(stationDto: StationDto, deleteGroupIds: number[], deleteItemIds: number[]): Promise<Station> {
        const stationId: number = stationDto.stationId;

        // update the station itself
        await this.stationRepository.save({
            stationId,
            title: stationDto.title,
            description: stationDto.description,
            maxFailed: stationDto.maxFailed,
        });


        // update the groups within the station
        for (const groupDto of stationDto.groups) {
            const group = await this.stationGroupRepository.save({
                groupId: groupDto.groupId,
                title: groupDto.title,
                level: groupDto.level,
                station: { stationId } as Station,
            });

            for (const itemDto of groupDto.items) {
                await this.stationItemRepository.save({
                    itemId: itemDto.itemId,
                    item: itemDto.item,
                    required: itemDto.required,
                    level: itemDto.level,
                    group: { groupId: group.groupId } as StationGroup,
                });
            }
        }

        for (const groupId of deleteGroupIds) {
            await this.stationGroupRepository.delete(groupId);
        }

        for (const itemId of deleteItemIds) {
            await this.stationItemRepository.delete(itemId);
        }

        return await this.stationRepository.getStation(stationId);
    }
}