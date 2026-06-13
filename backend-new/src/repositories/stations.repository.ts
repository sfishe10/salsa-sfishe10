import {db} from "../data-source";
import {Station} from "../entities/station.entity";
import {NotFoundError} from "../errors/not-found-error";

export class StationsRepository {
    private repo = db.getRepository(Station);

    public async getAllStations(): Promise<Station[]> {
        return this.repo.find({
            order: { class: 'ASC', level: 'ASC'}
        })
    }

    public async getStation(id: number): Promise<Station> {
        const station: Station | null = await this.repo.findOne({
            where: { stationId: id },
            relations: {
                groups: {
                    items: true
                }
            },
            order: {
                groups: {
                    level: 'ASC',
                    items: {
                        level: 'ASC'
                    }
                },
            }
        })

        if (!station) {
            throw new NotFoundError('Station not found');
        }

        return station;

    }


}