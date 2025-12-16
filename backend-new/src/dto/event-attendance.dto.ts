import {Expose, Type} from "class-transformer";
import {MBEventDto} from "./mb-event.dto";
import {MemberDto} from "./member.dto";
import {SectionDto} from "./section.dto";

export class EventAttendanceDto {
    @Expose()
    attendanceId!: number;

    @Expose()
    @Type(() => MBEventDto)
    event!: MBEventDto;

    @Expose()
    attendance!: string | null;

    @Expose()
    @Type(() => MemberDto)
    member!: MemberDto | null;

    @Expose()
    @Type(() => MemberDto)
    sub!: MemberDto | null;

    @Expose()
    required!: boolean;

    @Expose()
    lastUpdated!: Date;

    @Expose()
    @Type(() => SectionDto)
    section!: SectionDto | null;
}