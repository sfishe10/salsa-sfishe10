import {db} from "../data-source";
import {Station} from "../entities/station.entity";
import {NotFoundError} from "../errors/not-found-error";
import {StationGroup} from "../entities/station-group.entity";
import {StationItem} from "../entities/station-item.entity";
import {StationPacket} from "../entities/station-packet.entity";

export class StationRepository {
    private repo = db.getRepository(Station);

    public async findAll(): Promise<Station[]> {
        return this.repo.find({
            order: { class: 'ASC', level: 'ASC'}
        })
    }

    public async findById(id: number): Promise<Station> {
        const station: Station | null = await this.repo.findOne({
            where: { stationId: id },
            relations: {
                groups: {
                    items: true
                },
                packets: true
            },
            order: {
                groups: {
                    level: 'ASC',
                    items: {
                        level: 'ASC'
                    }
                },
                packets: {
                    level: 'ASC'
                }
            }
        })

        if (!station) {
            throw new NotFoundError('Station not found');
        }

        return station;

    }

    public async save(station: Partial<Station>) {
        return await this.repo.save(station);
    }

}

export class StationGroupRepository {
    private repo = db.getRepository(StationGroup);

    public async save(stationGroup: Partial<StationGroup>) {
        return await this.repo.save(stationGroup);
    }

    public async delete(groupId: number) {
        return await this.repo.delete(groupId);
    }

    public async findById(groupId: number) {
        const group: StationGroup | null = await this.repo.findOne({
            where: {groupId},
            relations: {items: true}
        })

        if (!group) {
            throw new NotFoundError('Group not found');
        }

        return group;
    }
}

export class StationItemRepository {
    private repo = db.getRepository(StationItem);

    public async save(stationItem: Partial<StationItem>) {
        return await this.repo.save(stationItem);
    }

    public async delete(itemId: number) {
        return await this.repo.delete(itemId);
    }
}

export class StationPacketRepository {
    private repo = db.getRepository(StationPacket);

    public async save(stationPacket: Partial<StationPacket>) {
        return await this.repo.save(stationPacket);
    }

    public async delete(packetId: number) {
        return await this.repo.delete(packetId);
    }

    public async findById(packetId: number) {
        const packet: StationPacket | null = await this.repo.findOne({
            where: {packetId},
            relations: {station: true}
        })

        if (!packet) {
            throw new NotFoundError('Packet not found');
        }

        return packet;
    }
}
