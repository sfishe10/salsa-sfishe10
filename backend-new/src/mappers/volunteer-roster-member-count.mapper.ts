import {toSectionDto} from "./section.mapper";
import {plainToInstance} from "class-transformer";
import {VolunteerRosterMemberCount} from "../entities/volunteer-roster-member-count.entity";
import {VolunteerRosterMemberCountDto} from "../dto/volunteer-roster-member-count.dto";
import {toMbEventDto} from "./mb-event.mapper";

export function toVolunteerRosterMemberCountDto(count: VolunteerRosterMemberCount): VolunteerRosterMemberCountDto {
    const plainObj = {
        numMembersNeeded: count.numMembersNeeded,

        event: count.event ? toMbEventDto(count.event) : null,
        section: count.section ? toSectionDto(count.section) : null
    };

    return plainToInstance(VolunteerRosterMemberCountDto, plainObj, { excludeExtraneousValues: true });
}