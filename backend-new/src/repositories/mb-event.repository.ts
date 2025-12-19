import {db} from "../config/data-source";
import {MBEvent} from "../entities/mb-event.entity";
import {LessThan, MoreThanOrEqual} from "typeorm";

export class MbEventRepository {
    private repo = db.getRepository(MBEvent);

    public async findById(id: number): Promise<MBEvent> {
        const mbEvent = await this.repo.findOne({ where: { eventId: id },
            relations: {
                term: true,
                pepBand: true,
            }
        });

        if (!mbEvent) {
            throw new Error('Event not found');
        }

        return mbEvent;
    }

    public async getUpcomingOrRecent(upcoming: boolean): Promise<MBEvent[]> {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        return this.repo.find({
            where: {
                date: upcoming ? MoreThanOrEqual(oneHourAgo) : LessThan(oneHourAgo),
                term: {
                    startDate: LessThan(new Date()),
                    endDate: MoreThanOrEqual(new Date()),
                },
            },
            relations: {
                term: true,
                pepBand: true,
            },
            order: {
                date: 'DESC',
            },
        });
    }

    public async getByTermId(termId: number): Promise<MBEvent[]> {
        return this.repo.find({
            where: { term: { termId } },
            relations: {
                term: true,
                pepBand: true,
            },
            order: {
                date: 'DESC',
            },
        });
    }

    public async save(mbEvent: Partial<MBEvent>): Promise<MBEvent> {
        return await this.repo.save(mbEvent);
    }

    public async delete(eventId: number): Promise<void> {
        await this.repo.delete(eventId);
    }

}