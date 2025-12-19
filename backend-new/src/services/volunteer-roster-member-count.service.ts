import {VolunteerRosterMemberCountRepository} from "../repositories/volunteer-roster-member-count.repository";
import {VolunteerRosterMemberCount} from "../entities/volunteer-roster-member-count.entity";
import {MBEvent} from "../entities/mb-event.entity";
import {Section} from "../entities/section.entity";


export class VolunteerRosterMemberCountService {
    private vrmcRepo: VolunteerRosterMemberCountRepository;

    constructor(vrmcRepo?: VolunteerRosterMemberCountRepository) {
        this.vrmcRepo = vrmcRepo ?? new VolunteerRosterMemberCountRepository();
    }

    public async getByEventId(eventId: number) {
        return await this.vrmcRepo.findByEventId(eventId);
    }

    public async getBySectionAndEventId(sectionId: number, eventId: number) {
        return await this.vrmcRepo.findBySectionAndEventId(sectionId, eventId);
    }


    public async create(event: MBEvent, section: Section, numMembersNeeded: number | null) {
        const newCount: VolunteerRosterMemberCount = new VolunteerRosterMemberCount();
        newCount.mbEvent = event;
        newCount.section = section;
        newCount.eventId = event.eventId;
        newCount.sectionId = section.sectionId;
        newCount.numMembersNeeded = numMembersNeeded;

        return await this.vrmcRepo.save(newCount)
    }

    public async update(count: VolunteerRosterMemberCount) {
        return await this.vrmcRepo.save(count)
    }

    public async delete(count: VolunteerRosterMemberCount) {
        return await this.vrmcRepo.delete(count)
    }
}