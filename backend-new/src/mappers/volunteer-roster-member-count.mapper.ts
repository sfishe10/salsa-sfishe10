import {toSectionDto} from "./section.mapper";
import {plainToInstance} from "class-transformer";
import {VolunteerRosterMemberCount} from "../entities/volunteer-roster-member-count.entity";
import {VolunteerRosterMemberCountDto} from "../dto/volunteer-roster-member-count.dto";

export function toVolunteerRosterMemberCountDto(count: VolunteerRosterMemberCount): VolunteerRosterMemberCountDto {
    const plainObj = {
        numMembersNeeded: count.numMembersNeeded,
        eventId: count.eventId,

        section: toSectionDto(count.section)
    };

    return plainToInstance(VolunteerRosterMemberCountDto, plainObj, { excludeExtraneousValues: true });
}