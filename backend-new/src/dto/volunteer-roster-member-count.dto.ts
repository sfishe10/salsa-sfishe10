import { Expose, Type } from 'class-transformer';
import { SectionDto } from './section.dto';
import { MBEventDto } from './mb-event.dto';

export class VolunteerRosterMemberCountDto {
    @Expose()
    @Type(() => SectionDto)
    section!: SectionDto;

    @Expose()
    @Type(() => MBEventDto)
    mbEvent!: MBEventDto;

    @Expose()
    numMembersNeeded!: number | null;
}
