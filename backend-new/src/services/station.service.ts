import {
    StationGroupRepository,
    StationItemRepository,
    StationPacketRepository,
    StationRepository
} from "../repositories/station.repository";
import {Station} from "../entities/station.entity";
import {StationDto} from "../dto/station.dto";
import {StationGroup} from "../entities/station-group.entity";
import {StationItem} from "../entities/station-item.entity";
import {StationPacket} from "../entities/station-packet.entity";
import {StationPacketDto} from "../dto/station-packet.dto";

export class StationService {
    private stationRepository: StationRepository;
    private stationGroupRepository: StationGroupRepository;
    private stationItemRepository: StationItemRepository;
    private stationPacketRepository: StationPacketRepository;

    constructor(stationsRepository?: StationRepository,
                stationGroupRepository?: StationGroupRepository,
                stationItemRepository?: StationItemRepository,
                stationPacketRepository?: StationPacketRepository) {
        this.stationRepository = stationsRepository ?? new StationRepository();
        this.stationGroupRepository = stationGroupRepository ?? new StationGroupRepository();
        this.stationItemRepository = stationItemRepository ?? new StationItemRepository();
        this.stationPacketRepository = stationPacketRepository ?? new StationPacketRepository();
    }

    public async getById(id: number): Promise<Station> {
        const station: Station = await this.stationRepository.findById(id);

        return station;
    }

    public async getAll(): Promise<Station[]> {
        return await this.stationRepository.findAll();
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

        // update the groups and items within the station
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
            await this.deleteGroup(groupId);
        }

        for (const itemId of deleteItemIds) {
            await this.deleteItem(itemId);
        }

        for (const packetDto of stationDto.packets) {
            // from the Station update page, the only thing that might be updated is the order of the station packets
            // or the title, if this is a new packet being added
            await this.stationPacketRepository.save({
                packetId: packetDto.packetId,
                station: { stationId } as Station,
                title: packetDto.title,
                level: packetDto.level
            })
        }

        return await this.stationRepository.findById(stationId);
    }

    private async deleteGroup(groupId: number) {
        const group = await this.stationGroupRepository.findById(groupId);

        for (const item of group.items) {
            await this.deleteItem(item.itemId);
        }

        await this.stationGroupRepository.delete(group.groupId);
    }

    private async deleteItem(itemId: number) {
        await this.stationItemRepository.delete(itemId);
    }

    public async getPacketById(id: number): Promise<StationPacket> {
        const packet: StationPacket = await this.stationPacketRepository.findById(id);

        return packet;
    }

    public async savePacket(packetDto: StationPacketDto): Promise<StationPacket> {
        let packet = {
            packetId: packetDto.packetId,
            station: {stationId: packetDto.station.stationId} as Station,
            title: packetDto.title,
            role: packetDto.role,
            info: packetDto.info ?? '',
            content: packetDto.content ?? ''
        }

        await this.stationPacketRepository.save(packet)

        return this.getPacketById(packet.packetId);
    }

    public async deletePacket(packetId: number) {
        await this.stationPacketRepository.delete(packetId)
    }
}