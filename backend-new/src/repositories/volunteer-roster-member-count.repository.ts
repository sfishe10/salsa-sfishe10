import {db} from "../data-source";
import {VolunteerRosterMemberCount} from "../entities/volunteer-roster-member-count.entity";

export class VolunteerRosterMemberCountRepository {
    private repo = db.getRepository(VolunteerRosterMemberCount);

    public async findByEventId(id: number) {
        return this.repo.find({
            where: { eventId: id }
        });
    }

    public async findBySectionAndEventId(sectionId: number, eventId: number): Promise<VolunteerRosterMemberCount> {
        const count = await this.repo.findOne({
            where: {eventId, sectionId}
        });

        if (!count) {
            throw new Error('Count not found');
        }

        return count;
    }

    async save(count: Partial<VolunteerRosterMemberCount>) {
        return await this.repo.save(count);
    }

    public async delete(count: VolunteerRosterMemberCount): Promise<void> {
        // here, we use remove() instead of delete() because remove() takes in the whole entity while delete() needs
        // a primary key, and this class uses a composite key (sectionId + eventId)
        await this.repo.remove(count);
    }
}